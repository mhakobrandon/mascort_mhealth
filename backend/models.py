from sqlalchemy import Column, Integer, String, Float, DateTime, Text, Boolean, ForeignKey, ARRAY
from sqlalchemy.dialects.postgresql import UUID, JSONB
from sqlalchemy.orm import declarative_base
from datetime import datetime
import uuid

Base = declarative_base()

# ==================== USER MODELS ====================

class User(Base):
    """Anonymous user identified by UUID token"""
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(UUID(as_uuid=True), default=uuid.uuid4, unique=True)
    device_id = Column(String, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    last_accessed = Column(DateTime, default=datetime.utcnow)

class UserSession(Base):
    """Track user sessions for analytics"""
    __tablename__ = "user_sessions"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.user_id"))
    session_token = Column(String, unique=True)
    screens_visited = Column(ARRAY(String), default=[])
    created_at = Column(DateTime, default=datetime.utcnow)

# ==================== HEALTH DATA MODELS ====================

class PreventionMethod(Base):
    """HIV and pregnancy prevention methods"""
    __tablename__ = "prevention_methods"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    category = Column(String)  # "contraception", "hiv_prevention", etc.
    description = Column(Text)
    effectiveness = Column(Integer)  # 0-100 percentage
    cost = Column(String)
    side_effects = Column(Text)
    how_to_use = Column(Text)
    details = Column(JSONB)  # Flexible data for steps, availability, etc.
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

class Clinic(Base):
    """Healthcare service providers"""
    __tablename__ = "clinics"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    location = Column(String)
    latitude = Column(Float)
    longitude = Column(Float)
    phone = Column(String)
    services = Column(ARRAY(String))  # ["youth_clinic", "hiv_testing", "counseling"]
    opening_hours = Column(String)
    is_lgbtq_friendly = Column(Boolean, default=True)
    rating = Column(Float, default=0.0)
    created_at = Column(DateTime, default=datetime.utcnow)

class SupportGroup(Base):
    """Peer support groups"""
    __tablename__ = "support_groups"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    group_type = Column(String)  # "hiv_support", "pregnancy_support", etc.
    description = Column(Text)
    meeting_schedule = Column(String)
    location = Column(String)
    contact_person = Column(String)
    contact_phone = Column(String)
    location_id = Column(Integer, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

# ==================== COUNSELLING MODELS ====================

class Counsellor(Base):
    """Professional counsellors"""
    __tablename__ = "counsellors"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String)
    specialization = Column(String)
    phone = Column(String)
    email = Column(String)
    availability = Column(String)
    languages = Column(ARRAY(String))
    is_available = Column(Boolean, default=True)
    bio = Column(Text)
    created_at = Column(DateTime, default=datetime.utcnow)

class CounsellingSession(Base):
    """Booked counselling sessions"""
    __tablename__ = "counselling_sessions"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.user_id"))
    counsellor_id = Column(Integer, ForeignKey("counsellors.id"))
    session_type = Column(String)  # "video", "phone", "chat"
    session_date = Column(DateTime)
    status = Column(String)  # "pending", "completed", "cancelled"
    notes = Column(Text)
    created_at = Column(DateTime, default=datetime.utcnow)

# ==================== AI & CHAT MODELS ====================

class AIConversation(Base):
    """Anonymous conversations with AI assistant"""
    __tablename__ = "ai_conversations"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.user_id"))
    conversation_data = Column(JSONB)  # Store all messages
    topic = Column(String)  # "hiv_prevention", "pregnancy_options", etc.
    created_at = Column(DateTime, default=datetime.utcnow)

# ==================== COMMODITY MODELS ====================

class CommodityRequest(Base):
    """Discrete requests for prevention commodities"""
    __tablename__ = "commodity_requests"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.user_id"))
    item_type = Column(String)  # "condom", "pill", "hst", etc.
    quantity = Column(Integer)
    delivery_method = Column(String)  # "pickup", "home_delivery"
    delivery_location = Column(String)
    status = Column(String)  # "requested", "in_progress", "completed"
    completed_at = Column(DateTime, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

# ==================== CONTENT MODELS ====================

class VideoGuide(Base):
    """How-to guide videos"""
    __tablename__ = "video_guides"
    
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String)
    description = Column(Text)
    video_url = Column(String)
    duration_seconds = Column(Integer)
    category = Column(String)  # "condom_use", "hiv_testing", etc.
    thumbnail_url = Column(String, nullable=True)
    views_count = Column(Integer, default=0)
    created_at = Column(DateTime, default=datetime.utcnow)

class Testimonial(Base):
    """User testimonials"""
    __tablename__ = "testimonials"
    
    id = Column(Integer, primary_key=True, index=True)
    author_name = Column(String)
    content = Column(Text)
    rating = Column(Integer)  # 1-5 stars
    topic = Column(String)
    is_approved = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)

# ==================== ANALYTICS MODELS ====================

class UserEngagement(Base):
    """Track user interactions for health insights"""
    __tablename__ = "user_engagement"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.user_id"))
    action_type = Column(String)  # "viewed_method", "searched", "watched_video"
    resource_id = Column(Integer, nullable=True)
    metadata = Column(JSONB)
    created_at = Column(DateTime, default=datetime.utcnow)

class HealthMetric(Base):
    """Aggregated health metrics for reporting"""
    __tablename__ = "health_metrics"
    
    id = Column(Integer, primary_key=True, index=True)
    metric_type = Column(String)  # "hiv_tests_requested", "contraception_searches"
    count = Column(Integer)
    location = Column(String, nullable=True)
    date = Column(DateTime, default=datetime.utcnow)
