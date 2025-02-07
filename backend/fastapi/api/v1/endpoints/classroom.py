from fastapi import APIRouter, Request, Depends, HTTPException
from sqlalchemy.orm import Session
from backend.fastapi.dependencies.database import get_sync_db, Base

Teacher = Base.classes.teachers  # Replace 'teachers' with the actual table name


router = APIRouter()

def get_current_user(request: Request):
    if not request.session.get("authenticated"):
        raise HTTPException(status_code=401, detail="Unauthorized")

    teacher_id = request.session.get("teacher_id")  # Retrieve teacher_id from session
    if not teacher_id:
        raise HTTPException(status_code=401, detail="Unauthorized - No teacher_id in session")
    
    return teacher_id  # Return the teacher_id


@router.get("/usernames")
def all_users(request: Request, user: bool = Depends(get_current_user), db: Session = Depends(get_sync_db)):
    # Access the teachers table through the automapped Base

    # Query for all emails in the teachers table
    teacher_emails = db.query(Teacher.email).all()  # Fetch all email addresses

    # Return the list of emails in the response
    return {"teacher_emails": [email[0] for email in teacher_emails]}  # Extract email from tuple


@router.get("/home-room")
async def home_room(
    teacher_id: int = Depends(get_current_user),  # Now user is a dictionary with teacher_id
):  
    return {
        "message": "You accessed protected data!",
        "teacher_id": teacher_id,
        "status": "success"
    }
