from sqlalchemy import Column, Integer, String, Float, DateTime, Text, Boolean, ForeignKey, JSON
from sqlalchemy.orm import declarative_base
from datetime import datetime, timezone
import uuid

Base = declarative_base()

# ==================== USER MODELS ====================

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(String(36), default=lambda: str(uuid.uuid4()), unique=True, index=True)
    device_id = Column(String, nullable=True)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    last_accessed = Column(DateTime, default=lambda: datetime.now(timezone.utc))


class UserSession(Base):
    __tablename__ = "user_sessions"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(String(36), ForeignKey("users.user_id"))
    session_token = Column(String, unique=True)
    screens_visited = Column(JSON, default=list)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))


# ==================== HEALTH DATA MODELS ====================

class PreventionMethod(Base):
    __tablename__ = "prevention_methods"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    category = Column(String)
    description = Column(Text)
    effectiveness = Column(Integer)
    cost = Column(String)
    side_effects = Column(Text)
    how_to_use = Column(Text)
    details = Column(JSON)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    updated_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))


class Clinic(Base):
    __tablename__ = "clinics"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    location = Column(String)
    latitude = Column(Float)
    longitude = Column(Float)
    phone = Column(String)
    services = Column(JSON, default=list)
    opening_hours = Column(String)
    is_lgbtq_friendly = Column(Boolean, default=True)
    rating = Column(Float, default=0.0)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))


class SupportGroup(Base):
    __tablename__ = "support_groups"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    group_type = Column(String)
    description = Column(Text)
    meeting_schedule = Column(String)
    location = Column(String)
    contact_person = Column(String)
    contact_phone = Column(String)
    location_id = Column(Integer, nullable=True)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))


# ==================== COUNSELLING MODELS ====================

class Counsellor(Base):
    __tablename__ = "counsellors"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String)
    specialization = Column(String)
    phone = Column(String)
    email = Column(String)
    availability = Column(String)
    languages = Column(JSON, default=list)
    is_available = Column(Boolean, default=True)
    bio = Column(Text)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))


class CounsellingSession(Base):
    __tablename__ = "counselling_sessions"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(String(36), ForeignKey("users.user_id"))
    counsellor_id = Column(Integer, ForeignKey("counsellors.id"))
    session_type = Column(String)
    session_date = Column(DateTime)
    status = Column(String)
    notes = Column(Text)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))


# ==================== AI & CHAT MODELS ====================

class AIConversation(Base):
    __tablename__ = "ai_conversations"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(String(36), ForeignKey("users.user_id"))
    conversation_data = Column(JSON, default=list)
    topic = Column(String)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))


# ==================== COMMODITY MODELS ====================

class CommodityRequest(Base):
    __tablename__ = "commodity_requests"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(String(36), ForeignKey("users.user_id"))
    item_type = Column(String)
    quantity = Column(Integer)
    delivery_method = Column(String)
    delivery_location = Column(String)
    status = Column(String)
    completed_at = Column(DateTime, nullable=True)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))


# ==================== CONTENT MODELS ====================

class VideoGuide(Base):
    __tablename__ = "video_guides"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String)
    description = Column(Text)
    video_url = Column(String)
    duration_seconds = Column(Integer)
    category = Column(String)
    thumbnail_url = Column(String, nullable=True)
    views_count = Column(Integer, default=0)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))


class Testimonial(Base):
    __tablename__ = "testimonials"

    id = Column(Integer, primary_key=True, index=True)
    author_name = Column(String)
    content = Column(Text)
    rating = Column(Integer)
    topic = Column(String)
    is_approved = Column(Boolean, default=False)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))


# ==================== ANALYTICS MODELS ====================

class UserEngagement(Base):
    __tablename__ = "user_engagement"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(String(36), ForeignKey("users.user_id"))
    action_type = Column(String)
    resource_id = Column(Integer, nullable=True)
    event_data = Column(JSON)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))


class HealthMetric(Base):
    __tablename__ = "health_metrics"

    id = Column(Integer, primary_key=True, index=True)
    metric_type = Column(String)
    count = Column(Integer)
    location = Column(String, nullable=True)
    date = Column(DateTime, default=lambda: datetime.now(timezone.utc))
