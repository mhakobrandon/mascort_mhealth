from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List
import logging
from math import radians, cos, sin, asin, sqrt

from models import Clinic, SupportGroup
from schemas import Clinic as ClinicSchema, ClinicCreate, ClinicWithDistance
from database.connection import get_db

router = APIRouter()
logger = logging.getLogger(__name__)


def haversine_distance(lat1: float, lon1: float, lat2: float, lon2: float) -> float:
    """Calculate great-circle distance in km between two lat/lon points."""
    lon1, lat1, lon2, lat2 = map(radians, [lon1, lat1, lon2, lat2])
    dlon = lon2 - lon1
    dlat = lat2 - lat1
    a = sin(dlat / 2) ** 2 + cos(lat1) * cos(lat2) * sin(dlon / 2) ** 2
    return 2 * asin(sqrt(a)) * 6371


# Static routes must come before parameterized ones

@router.get("/nearby", response_model=List[ClinicWithDistance])
async def get_nearby_clinics(
    latitude: float = Query(...),
    longitude: float = Query(...),
    radius_km: float = Query(5.0, ge=0.1, le=50),
    db: Session = Depends(get_db)
):
    """Get clinics within radius_km of the given location."""
    all_clinics = db.query(Clinic).all()
    nearby = []

    for clinic in all_clinics:
        distance = haversine_distance(latitude, longitude, clinic.latitude, clinic.longitude)
        if distance <= radius_km:
            nearby.append(
                ClinicWithDistance(
                    id=clinic.id,
                    name=clinic.name,
                    distance_km=round(distance, 2)
                )
            )

    nearby.sort(key=lambda x: x.distance_km)
    return nearby


@router.get("/search/name", response_model=List[ClinicSchema])
async def search_clinics_by_name(
    query: str = Query(..., min_length=1),
    db: Session = Depends(get_db)
):
    """Search clinics by name"""
    clinics = db.query(Clinic).filter(
        Clinic.name.ilike(f"%{query}%")
    ).all()
    return clinics


@router.get("/groups/", response_model=List[dict])
async def get_support_groups(
    group_type: str = Query(None),
    db: Session = Depends(get_db)
):
    """Get all support groups"""
    query = db.query(SupportGroup)
    if group_type:
        query = query.filter(SupportGroup.group_type == group_type)
    groups = query.all()

    return [
        {
            "id": group.id,
            "name": group.name,
            "type": group.group_type,
            "description": group.description,
            "meeting_schedule": group.meeting_schedule,
            "location": group.location,
            "contact": {
                "person": group.contact_person,
                "phone": group.contact_phone
            }
        }
        for group in groups
    ]


@router.get("/groups/{group_id}")
async def get_support_group(
    group_id: int,
    db: Session = Depends(get_db)
):
    """Get details about a support group"""
    group = db.query(SupportGroup).filter(SupportGroup.id == group_id).first()

    if not group:
        raise HTTPException(status_code=404, detail="Support group not found")

    return {
        "id": group.id,
        "name": group.name,
        "type": group.group_type,
        "description": group.description,
        "meeting_schedule": group.meeting_schedule,
        "location": group.location,
        "contact": {
            "person": group.contact_person,
            "phone": group.contact_phone
        }
    }


@router.get("/", response_model=List[ClinicSchema])
async def get_all_clinics(
    services: str = Query(None),
    is_lgbtq_friendly: bool = Query(None),
    db: Session = Depends(get_db)
):
    """Get all clinics with optional filters"""
    query = db.query(Clinic)

    if services:
        # JSON column in SQLite: filter in Python after fetch
        clinics = query.all()
        return [c for c in clinics if services in (c.services or [])]

    if is_lgbtq_friendly is not None:
        query = query.filter(Clinic.is_lgbtq_friendly == is_lgbtq_friendly)

    clinics = query.all()
    return clinics


@router.post("/", response_model=ClinicSchema)
async def create_clinic(
    clinic: ClinicCreate,
    db: Session = Depends(get_db)
):
    """Create new clinic (admin only)"""
    db_clinic = Clinic(**clinic.model_dump())
    db.add(db_clinic)
    db.commit()
    db.refresh(db_clinic)
    return db_clinic


@router.get("/{clinic_id}", response_model=ClinicSchema)
async def get_clinic(
    clinic_id: int,
    db: Session = Depends(get_db)
):
    """Get details about a specific clinic"""
    clinic = db.query(Clinic).filter(Clinic.id == clinic_id).first()

    if not clinic:
        raise HTTPException(status_code=404, detail="Clinic not found")

    return clinic
