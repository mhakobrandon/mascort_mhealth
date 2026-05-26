from fastapi import APIRouter, Depends, HTTPException, Header
from sqlalchemy.orm import Session
from typing import Optional
import uuid
import os
import jwt
from datetime import datetime, timedelta, timezone
import logging

from models import User, UserSession
from database.connection import get_db

router = APIRouter()
logger = logging.getLogger(__name__)

JWT_SECRET = os.getenv("JWT_SECRET", "mascot_mhealth_default_secret_key_change_in_prod")
JWT_ALGORITHM = os.getenv("JWT_ALGORITHM", "HS256")
JWT_EXPIRATION_HOURS = int(os.getenv("JWT_EXPIRATION_HOURS", "24"))


def create_token(user_uuid: str) -> str:
    payload = {
        "sub": user_uuid,
        "iat": datetime.now(timezone.utc),
        "exp": datetime.now(timezone.utc) + timedelta(hours=JWT_EXPIRATION_HOURS),
    }
    return jwt.encode(payload, JWT_SECRET, algorithm=JWT_ALGORITHM)


def verify_token(token: str) -> Optional[str]:
    try:
        payload = jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGORITHM])
        return payload.get("sub")
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token expired")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Invalid token")


def get_current_user(
    authorization: Optional[str] = Header(None),
    db: Session = Depends(get_db)
) -> Optional[User]:
    """Extract user from Bearer token (optional — anonymous access allowed)."""
    if not authorization or not authorization.startswith("Bearer "):
        return None
    token = authorization.split(" ", 1)[1]
    user_uuid = verify_token(token)
    user = db.query(User).filter(User.user_id == user_uuid).first()
    if not user:
        raise HTTPException(status_code=401, detail="User not found")
    user.last_accessed = datetime.now(timezone.utc)
    db.commit()
    return user


@router.post("/register")
async def register_user(
    device_id: Optional[str] = None,
    db: Session = Depends(get_db)
):
    """
    Register a new anonymous user.
    Returns a UUID-based JWT token — no personal data required.
    """
    user_uuid = uuid.uuid4()
    user = User(
        user_id=str(user_uuid),
        device_id=device_id,
        created_at=datetime.now(timezone.utc),
        last_accessed=datetime.now(timezone.utc),
    )
    db.add(user)
    db.commit()
    db.refresh(user)

    token = create_token(str(user_uuid))

    # Create initial session
    session_token = str(uuid.uuid4())
    session = UserSession(
        user_id=str(user_uuid),
        session_token=session_token,
        screens_visited=[],
        created_at=datetime.now(timezone.utc),
    )
    db.add(session)
    db.commit()

    logger.info(f"New anonymous user registered: {user_uuid}")

    return {
        "success": True,
        "user_id": str(user_uuid),
        "token": token,
        "session_token": session_token,
        "message": "Anonymous registration successful"
    }


@router.get("/session/{session_token}")
async def get_user_session(
    session_token: str,
    db: Session = Depends(get_db)
):
    """Get session info by session token"""
    session = db.query(UserSession).filter(
        UserSession.session_token == session_token
    ).first()

    if not session:
        raise HTTPException(status_code=404, detail="Session not found")

    return {
        "session_token": session_token,
        "user_id": str(session.user_id),
        "screens_visited": session.screens_visited or [],
        "created_at": session.created_at.isoformat(),
    }


@router.post("/session/{session_token}/track")
async def track_screen_visit(
    session_token: str,
    screen: str,
    db: Session = Depends(get_db)
):
    """Track a screen visit for analytics"""
    session = db.query(UserSession).filter(
        UserSession.session_token == session_token
    ).first()

    if not session:
        raise HTTPException(status_code=404, detail="Session not found")

    screens = list(session.screens_visited or [])
    if screen not in screens:
        screens.append(screen)
    session.screens_visited = screens
    db.commit()

    return {"success": True, "screens_visited": screens}


@router.post("/refresh")
async def refresh_token(
    authorization: str = Header(...),
    db: Session = Depends(get_db)
):
    """Refresh JWT token"""
    if not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Bearer token required")

    token = authorization.split(" ", 1)[1]
    user_uuid = verify_token(token)

    user = db.query(User).filter(User.user_id == user_uuid).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    new_token = create_token(user_uuid)
    return {"success": True, "token": new_token}
