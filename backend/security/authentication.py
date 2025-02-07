## login for a teacher, you can use the email and corresponding password to authenticate


from sqlalchemy.orm import Session
from fastapi import Depends
from backend.fastapi.dependencies.database import get_sync_db, Base

Teacher = Base.classes.teachers  # Replace 'teachers' with the actual table name

def authenticate_user(email: str, password: str, db: Session) -> bool:
    """Authenticate user by checking database for matching username and password (plain-text)."""

    # Query the database for a teacher with the given username & password
    user = db.query(Teacher).filter(Teacher.email == email, Teacher.password == password).first()

    # Return True if a match is found
    return user
