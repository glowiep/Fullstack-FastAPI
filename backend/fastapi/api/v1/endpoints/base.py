import os
from fastapi import APIRouter,Depends
from fastapi.responses import JSONResponse
from sqlalchemy.orm import Session
from backend.fastapi.dependencies.database import get_sync_db, Base
from fastapi.responses import RedirectResponse


root_router = APIRouter()

@root_router.get("/")
def onboard_message():
    # Redirect to the React frontend's root URL
    return RedirectResponse(url=os.getenv("REACT_FRONTEND_URL", "http://localhost:3000"))
