from fastapi import Depends, Request, HTTPException
from fastapi import APIRouter
from fastapi.responses import HTMLResponse, RedirectResponse
from fastapi.templating import Jinja2Templates
from backend.security.authentication import authenticate_user
from backend.fastapi.dependencies.database import get_sync_db
from sqlalchemy.orm import Session
from pydantic import BaseModel


router = APIRouter()
templates = Jinja2Templates(directory="frontend/login/templates")

# Define a Pydantic model for the JSON payload
class LoginPayload(BaseModel):
    username: str
    password: str

@router.post("/login")
async def login(request: Request, payload: LoginPayload, db: Session = Depends(get_sync_db)):
    # Authenticate the user using the payload data
    user = authenticate_user(payload.username, payload.password, db)
    
    if user:
        # Set session data
        request.session['authenticated'] = True
        request.session['teacher_id'] = user.teacher_id
        
        # Redirect to the home page
        return RedirectResponse(url="/home", status_code=200)
    else:
        # Return a JSON response for invalid credentials
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
@router.get("/logout", response_class=HTMLResponse)
async def logout(request: Request):
    request.session.clear()
    return RedirectResponse(url="/login")


