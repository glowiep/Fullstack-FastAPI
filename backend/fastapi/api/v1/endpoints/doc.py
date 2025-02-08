import os
from fastapi import Depends, Form, Request
from fastapi import APIRouter
from fastapi.responses import HTMLResponse, RedirectResponse
from fastapi.templating import Jinja2Templates
from backend.security.authentication import authenticate_user
from backend.fastapi.dependencies.database import get_sync_db
from sqlalchemy.orm import Session



router = APIRouter()
templates = Jinja2Templates(directory="frontend/login/templates")

# Endpoint for login form
@router.get("/login", response_class=HTMLResponse)
async def login_form(request: Request):
    return templates.TemplateResponse("login.html", {"request": request})

@router.post("/login", response_class=HTMLResponse)
async def login(request: Request, username: str = Form(...), password: str = Form(...),db: Session = Depends(get_sync_db)):
    user = authenticate_user(username, password, db)
    if user:
        request.session['authenticated'] = True
        request.session['teacher_id'] = user.teacher_id 
        return RedirectResponse(url="/home-room", status_code=303)
    else:
        message = "Invalid credentials"
        return templates.TemplateResponse("login.html", {"request": request, "message": message})
    
@router.get("/logout", response_class=HTMLResponse)
async def logout(request: Request):
    request.session.clear()
    return RedirectResponse(url="/login")


