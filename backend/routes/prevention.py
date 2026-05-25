from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List
import logging

from models import PreventionMethod
from schemas import PreventionMethod as PreventionMethodSchema, PreventionMethodCreate
from database.connection import get_db

router = APIRouter()
logger = logging.getLogger(__name__)


@router.get("/search/", response_model=List[PreventionMethodSchema])
async def search_prevention_methods(
    query: str = Query(..., min_length=1),
    db: Session = Depends(get_db)
):
    """Search prevention methods by name or description"""
    methods = db.query(PreventionMethod).filter(
        (PreventionMethod.name.ilike(f"%{query}%")) |
        (PreventionMethod.description.ilike(f"%{query}%"))
    ).all()
    return methods


@router.get("/effectiveness/high", response_model=List[PreventionMethodSchema])
async def get_high_effectiveness_methods(
    min_effectiveness: int = Query(80, ge=0, le=100),
    db: Session = Depends(get_db)
):
    """Get highly effective prevention methods"""
    methods = db.query(PreventionMethod).filter(
        PreventionMethod.effectiveness >= min_effectiveness
    ).order_by(PreventionMethod.effectiveness.desc()).all()
    return methods


@router.get("/category/{category}")
async def get_methods_by_category(
    category: str,
    db: Session = Depends(get_db)
):
    """Get prevention methods by category"""
    methods = db.query(PreventionMethod).filter(
        PreventionMethod.category == category
    ).all()

    if not methods:
        raise HTTPException(
            status_code=404,
            detail=f"No methods found for category: {category}"
        )

    return {
        "category": category,
        "count": len(methods),
        "methods": [
            {
                "id": m.id,
                "name": m.name,
                "description": m.description,
                "effectiveness": m.effectiveness,
                "cost": m.cost,
            }
            for m in methods
        ]
    }


@router.get("/", response_model=List[PreventionMethodSchema])
async def get_prevention_methods(
    category: str = Query(None),
    db: Session = Depends(get_db)
):
    """Get all prevention methods with optional category filter."""
    query = db.query(PreventionMethod)
    if category:
        query = query.filter(PreventionMethod.category == category)
    methods = query.all()
    return methods


@router.post("/", response_model=PreventionMethodSchema)
async def create_prevention_method(
    prevention: PreventionMethodCreate,
    db: Session = Depends(get_db)
):
    """Create a new prevention method (admin only)."""
    db_method = PreventionMethod(**prevention.model_dump())
    db.add(db_method)
    db.commit()
    db.refresh(db_method)
    return db_method


@router.get("/{method_id}", response_model=PreventionMethodSchema)
async def get_prevention_method(
    method_id: int,
    db: Session = Depends(get_db)
):
    """Get details about a specific prevention method"""
    method = db.query(PreventionMethod).filter(
        PreventionMethod.id == method_id
    ).first()

    if not method:
        raise HTTPException(status_code=404, detail="Prevention method not found")

    return method
