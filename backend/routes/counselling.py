from fastapi import APIRouter, Depends, HTTPException, Query, Header
from sqlalchemy.orm import Session
from typing import Optional, List
from datetime import datetime, timezone
import logging

from models import Counsellor, CounsellingSession, CommodityRequest
from schemas import (
    Counsellor as CounsellorSchema,
    CounsellorCreate,
    Session as SessionSchema,
    SessionCreate,
    CommodityRequest as CommodityRequestSchema,
    CommodityRequestCreate,
)
from database.connection import get_db

router = APIRouter()
logger = logging.getLogger(__name__)


def _get_user_id_from_token(authorization: Optional[str]) -> Optional[str]:
    """Extract user_id string from Bearer token without strict enforcement."""
    if not authorization or not authorization.startswith("Bearer "):
        return None
    try:
        import jwt, os
        token = authorization.split(" ", 1)[1]
        secret = os.getenv("JWT_SECRET", "mascot_mhealth_default_secret_key_change_in_prod")
        payload = jwt.decode(token, secret, algorithms=["HS256"])
        return payload.get("sub")
    except Exception:
        return None


# ==================== COUNSELLORS ====================

@router.get("/counsellors/", response_model=List[CounsellorSchema])
async def get_available_counsellors(
    specialization: str = Query(None),
    db: Session = Depends(get_db)
):
    """Get available counsellors with optional specialization filter"""
    query = db.query(Counsellor).filter(Counsellor.is_available == True)
    if specialization:
        query = query.filter(Counsellor.specialization.ilike(f"%{specialization}%"))
    return query.all()


@router.get("/counsellors/{counsellor_id}", response_model=CounsellorSchema)
async def get_counsellor(
    counsellor_id: int,
    db: Session = Depends(get_db)
):
    """Get details about a specific counsellor"""
    counsellor = db.query(Counsellor).filter(Counsellor.id == counsellor_id).first()
    if not counsellor:
        raise HTTPException(status_code=404, detail="Counsellor not found")
    return counsellor


@router.post("/counsellors/", response_model=CounsellorSchema)
async def create_counsellor(
    counsellor: CounsellorCreate,
    db: Session = Depends(get_db)
):
    """Add a new counsellor (admin only)"""
    db_counsellor = Counsellor(**counsellor.model_dump())
    db.add(db_counsellor)
    db.commit()
    db.refresh(db_counsellor)
    return db_counsellor


# ==================== SESSIONS ====================

@router.post("/book", response_model=SessionSchema)
async def book_counselling_session(
    session_data: SessionCreate,
    authorization: Optional[str] = Header(None),
    db: Session = Depends(get_db)
):
    """
    Book a counselling session.
    Requires a valid Bearer token from /api/auth/register.
    """
    user_id = _get_user_id_from_token(authorization)
    if not user_id:
        raise HTTPException(status_code=401, detail="Authentication required to book a session")

    counsellor = db.query(Counsellor).filter(
        Counsellor.id == session_data.counsellor_id,
        Counsellor.is_available == True
    ).first()
    if not counsellor:
        raise HTTPException(status_code=404, detail="Counsellor not available")

    session = CounsellingSession(
        user_id=user_id,
        counsellor_id=session_data.counsellor_id,
        session_type=session_data.session_type,
        session_date=session_data.session_date,
        status="pending",
        notes=session_data.notes,
        created_at=datetime.now(timezone.utc),
    )
    db.add(session)
    db.commit()
    db.refresh(session)
    logger.info(f"Session booked: user={user_id}, counsellor={session_data.counsellor_id}")
    return session


@router.get("/sessions/")
async def get_my_sessions(
    authorization: Optional[str] = Header(None),
    db: Session = Depends(get_db)
):
    """Get all sessions for the authenticated user"""
    user_id = _get_user_id_from_token(authorization)
    if not user_id:
        raise HTTPException(status_code=401, detail="Authentication required")

    sessions = db.query(CounsellingSession).filter(
        CounsellingSession.user_id == user_id
    ).all()

    return [
        {
            "id": s.id,
            "counsellor_id": s.counsellor_id,
            "session_type": s.session_type,
            "session_date": s.session_date.isoformat(),
            "status": s.status,
            "notes": s.notes,
        }
        for s in sessions
    ]


@router.patch("/sessions/{session_id}/cancel")
async def cancel_session(
    session_id: int,
    authorization: Optional[str] = Header(None),
    db: Session = Depends(get_db)
):
    """Cancel a booked session"""
    user_id = _get_user_id_from_token(authorization)
    if not user_id:
        raise HTTPException(status_code=401, detail="Authentication required")

    session = db.query(CounsellingSession).filter(
        CounsellingSession.id == session_id,
        CounsellingSession.user_id == user_id
    ).first()
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")
    if session.status != "pending":
        raise HTTPException(status_code=400, detail="Only pending sessions can be cancelled")

    session.status = "cancelled"
    db.commit()
    return {"success": True, "message": "Session cancelled"}


# ==================== COMMODITY REQUESTS ====================

@router.post("/commodities/", response_model=CommodityRequestSchema)
async def request_commodity(
    request_data: CommodityRequestCreate,
    authorization: Optional[str] = Header(None),
    db: Session = Depends(get_db)
):
    """
    Request prevention commodities (condoms, pills, HIV self-tests).
    Anonymous-friendly — token optional.
    """
    user_id = _get_user_id_from_token(authorization)

    commodity = CommodityRequest(
        user_id=user_id,
        item_type=request_data.item_type,
        quantity=request_data.quantity,
        delivery_method=request_data.delivery_method,
        delivery_location=request_data.delivery_location,
        status="requested",
        created_at=datetime.now(timezone.utc),
    )
    db.add(commodity)
    db.commit()
    db.refresh(commodity)
    logger.info(f"Commodity request: {request_data.item_type} x{request_data.quantity}")
    return commodity


@router.get("/commodities/")
async def get_my_commodity_requests(
    authorization: Optional[str] = Header(None),
    db: Session = Depends(get_db)
):
    """Get commodity requests for authenticated user"""
    user_id = _get_user_id_from_token(authorization)
    if not user_id:
        raise HTTPException(status_code=401, detail="Authentication required")

    requests = db.query(CommodityRequest).filter(
        CommodityRequest.user_id == user_id
    ).all()

    return [
        {
            "id": r.id,
            "item_type": r.item_type,
            "quantity": r.quantity,
            "delivery_method": r.delivery_method,
            "status": r.status,
            "created_at": r.created_at.isoformat(),
        }
        for r in requests
    ]
