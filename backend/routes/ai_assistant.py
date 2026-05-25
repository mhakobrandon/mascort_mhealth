from fastapi import APIRouter, Depends, HTTPException, Header
from sqlalchemy.orm import Session
from typing import Optional
from datetime import datetime, timezone
import logging

from models import AIConversation, HealthMetric
from schemas import MessageRequest
from database.connection import get_db

router = APIRouter()
logger = logging.getLogger(__name__)


def _get_user_id_from_token(authorization: Optional[str]) -> Optional[str]:
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


@router.post("/chat")
async def chat_with_ai(
    request: MessageRequest,
    conversation_id: Optional[int] = None,
    authorization: Optional[str] = Header(None),
    db: Session = Depends(get_db)
):
    """
    Chat with the MASCOT health AI assistant.
    Uses RAG to answer questions grounded in verified health documents.
    Anonymous — no account needed.
    """
    from ai.rag_pipeline import rag_pipeline

    user_id = _get_user_id_from_token(authorization)

    try:
        result = await rag_pipeline.query(request.message)
    except Exception as e:
        logger.error(f"RAG pipeline error: {e}")
        raise HTTPException(status_code=503, detail="AI assistant temporarily unavailable")

    response_text = result.get("response", "")
    confidence = result.get("confidence", 0.8)
    now = datetime.now(timezone.utc)

    # Persist conversation
    if user_id:
        if conversation_id:
            conv = db.query(AIConversation).filter(
                AIConversation.id == conversation_id,
                AIConversation.user_id == user_id
            ).first()
        else:
            conv = None

        if conv:
            messages = list(conv.conversation_data.get("messages", []))
        else:
            messages = []
            conv = AIConversation(
                user_id=user_id,
                conversation_data={"messages": []},
                topic=_detect_topic(request.message),
                created_at=now,
            )
            db.add(conv)

        messages.append({"role": "user", "content": request.message, "ts": now.isoformat()})
        messages.append({"role": "assistant", "content": response_text, "ts": now.isoformat()})
        conv.conversation_data = {"messages": messages}
        db.commit()
        db.refresh(conv)
        conv_id = conv.id
    else:
        conv_id = None

    # Track metric
    try:
        metric = HealthMetric(
            metric_type="ai_query",
            count=1,
            date=now,
        )
        db.add(metric)
        db.commit()
    except Exception:
        pass

    return {
        "conversation_id": conv_id,
        "response": response_text,
        "confidence": confidence,
        "sources": result.get("sources", []),
        "timestamp": now.isoformat(),
    }


@router.get("/history/{conversation_id}")
async def get_conversation_history(
    conversation_id: int,
    authorization: Optional[str] = Header(None),
    db: Session = Depends(get_db)
):
    """Get full message history for a conversation"""
    user_id = _get_user_id_from_token(authorization)
    if not user_id:
        raise HTTPException(status_code=401, detail="Authentication required")

    conv = db.query(AIConversation).filter(
        AIConversation.id == conversation_id,
        AIConversation.user_id == user_id
    ).first()

    if not conv:
        raise HTTPException(status_code=404, detail="Conversation not found")

    messages = conv.conversation_data.get("messages", [])
    return {
        "conversation_id": conversation_id,
        "topic": conv.topic,
        "messages": messages,
        "total_messages": len(messages),
    }


@router.get("/conversations/")
async def list_conversations(
    authorization: Optional[str] = Header(None),
    db: Session = Depends(get_db)
):
    """List all conversations for the authenticated user"""
    user_id = _get_user_id_from_token(authorization)
    if not user_id:
        raise HTTPException(status_code=401, detail="Authentication required")

    convs = db.query(AIConversation).filter(
        AIConversation.user_id == user_id
    ).order_by(AIConversation.created_at.desc()).all()

    return [
        {
            "id": c.id,
            "topic": c.topic,
            "message_count": len(c.conversation_data.get("messages", [])),
            "created_at": c.created_at.isoformat(),
        }
        for c in convs
    ]


@router.get("/topics/trending")
async def get_trending_topics(db: Session = Depends(get_db)):
    """Get most queried health topics (aggregated, anonymous)"""
    from sqlalchemy import func
    results = (
        db.query(AIConversation.topic, func.count(AIConversation.id).label("count"))
        .group_by(AIConversation.topic)
        .order_by(func.count(AIConversation.id).desc())
        .limit(10)
        .all()
    )
    return [{"topic": r.topic, "count": r.count} for r in results]


@router.post("/feedback/{conversation_id}")
async def submit_feedback(
    conversation_id: int,
    helpful: bool,
    authorization: Optional[str] = Header(None),
    db: Session = Depends(get_db)
):
    """Submit feedback for an AI conversation"""
    user_id = _get_user_id_from_token(authorization)
    if not user_id:
        raise HTTPException(status_code=401, detail="Authentication required")

    conv = db.query(AIConversation).filter(
        AIConversation.id == conversation_id,
        AIConversation.user_id == user_id
    ).first()
    if not conv:
        raise HTTPException(status_code=404, detail="Conversation not found")

    data = dict(conv.conversation_data)
    data["helpful"] = helpful
    conv.conversation_data = data
    db.commit()
    return {"success": True, "message": "Feedback recorded"}


def _detect_topic(message: str) -> str:
    """Simple keyword-based topic detection."""
    msg = message.lower()
    if any(k in msg for k in ["hiv", "aids", "test", "prep", "sti", "std"]):
        return "hiv_prevention"
    if any(k in msg for k in ["pregnant", "pregnancy", "period", "missed"]):
        return "pregnancy_options"
    if any(k in msg for k in ["condom", "pill", "contraception", "implant", "iud"]):
        return "contraception"
    if any(k in msg for k in ["clinic", "hospital", "doctor", "nurse"]):
        return "find_services"
    return "general_health"
