from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime
from enum import Enum

# ==================== ENUMS ====================

class SessionType(str, Enum):
    VIDEO = "video"
    PHONE = "phone"
    CHAT = "chat"

class SessionStatus(str, Enum):
    PENDING = "pending"
    ONGOING = "ongoing"
    COMPLETED = "completed"
    CANCELLED = "cancelled"

class CommodityType(str, Enum):
    CONDOM = "condom"
    PILL = "pill"
    INJECTABLE = "injectable"
    IMPLANT = "implant"
    IUD = "iud"
    HST = "hiv_self_test"

# ==================== USER SCHEMAS ====================

class UserBase(BaseModel):
    device_id: Optional[str] = None

class UserCreate(UserBase):
    pass

class User(UserBase):
    id: int

    class Config:
        from_attributes = True

# ==================== PREVENTION SCHEMAS ====================

class PreventionMethodDetail(BaseModel):
    steps: List[str]
    effectiveness: str
    side_effects: str
    availability: Optional[str] = None

class PreventionMethodBase(BaseModel):
    name: str
    category: str
    description: str
    effectiveness: int = Field(ge=0, le=100)
    cost: str
    side_effects: str
    how_to_use: str
    details: PreventionMethodDetail

class PreventionMethodCreate(PreventionMethodBase):
    pass

class PreventionMethod(PreventionMethodBase):
    id: int

    class Config:
        from_attributes = True

# ==================== CLINIC SCHEMAS ====================

class ClinicBase(BaseModel):
    name: str
    location: str
    latitude: float
    longitude: float
    phone: str
    services: List[str]
    opening_hours: str
    is_lgbtq_friendly: bool = True

class ClinicCreate(ClinicBase):
    pass

class ClinicWithDistance(BaseModel):
    id: int
    name: str
    distance_km: float

class Clinic(ClinicBase):
    id: int
    rating: float = 0.0

    class Config:
        from_attributes = True

# ==================== COUNSELLING SCHEMAS ====================

class CounsellorBase(BaseModel):
    name: str
    specialization: str
    phone: str
    email: str
    availability: str
    languages: List[str]

class CounsellorCreate(CounsellorBase):
    pass

class Counsellor(CounsellorBase):
    id: int
    is_available: bool

    class Config:
        from_attributes = True

class SessionBase(BaseModel):
    counsellor_id: int
    session_type: SessionType
    session_date: datetime
    notes: Optional[str] = None

class SessionCreate(SessionBase):
    pass

class Session(SessionBase):
    id: int
    status: str = "pending"

    class Config:
        from_attributes = True

# ==================== AI SCHEMAS ====================

class MessageRequest(BaseModel):
    message: str = Field(..., min_length=1, max_length=2000)

class MessageResponse(BaseModel):
    response: str
    confidence: float
    timestamp: datetime

class ConversationHistoryResponse(BaseModel):
    messages: List[dict]
    total_messages: int

# ==================== COMMODITY SCHEMAS ====================

class CommodityRequestBase(BaseModel):
    item_type: CommodityType
    quantity: int = Field(ge=1)
    delivery_method: str
    delivery_location: str
    notes: Optional[str] = None

class CommodityRequestCreate(CommodityRequestBase):
    pass

class CommodityRequest(CommodityRequestBase):
    id: int
    status: str = "requested"

    class Config:
        from_attributes = True

# ==================== SUPPORT GROUP SCHEMAS ====================

class SupportGroupBase(BaseModel):
    name: str
    group_type: str
    description: str
    meeting_schedule: str
    location: str
    contact_person: str
    contact_phone: str
    location_id: Optional[int] = None

class SupportGroupCreate(SupportGroupBase):
    pass

class SupportGroup(SupportGroupBase):
    id: int

    class Config:
        from_attributes = True

# ==================== HEALTH CONTENT SCHEMAS ====================

class VideoGuideBase(BaseModel):
    title: str
    description: str
    video_url: str
    duration_seconds: int
    category: str
    thumbnail_url: Optional[str] = None

class VideoGuide(VideoGuideBase):
    id: int
    views_count: int = 0

    class Config:
        from_attributes = True

class TestimonialBase(BaseModel):
    author_name: str
    content: str
    rating: int = Field(ge=1, le=5)
    topic: str

class Testimonial(TestimonialBase):
    id: int
    is_approved: bool = False

    class Config:
        from_attributes = True

# ==================== RESPONSE SCHEMAS ====================

class SuccessResponse(BaseModel):
    success: bool = True
    message: str
    data: Optional[dict] = None

class ErrorResponse(BaseModel):
    success: bool = False
    message: str
    details: Optional[dict] = None

class HealthCheck(BaseModel):
    status: str
    service: str
    timestamp: datetime
