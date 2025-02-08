import os
from fastapi import APIRouter,Depends
from fastapi.responses import JSONResponse
from sqlalchemy.orm import Session
from backend.fastapi.dependencies.database import get_sync_db, Base


router = APIRouter()

@router.get("/")
def onboard_message():
    return {"message": "You've been onboarded!"}
