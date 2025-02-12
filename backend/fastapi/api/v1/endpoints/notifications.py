from datetime import datetime, timedelta
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func
from backend.fastapi.dependencies.database import get_sync_db, Base

# Database Models
Observation = Base.classes.observations
Student = Base.classes.students

router = APIRouter()

THRESHOLD_DAYS = 7  # Change this as needed

@router.get("/notifications/falling_behind_students/")
async def get_falling_behind_students(db: Session = Depends(get_sync_db)):
    """
    API to get students falling behind in observations.
    """
    threshold_date = datetime.utcnow() - timedelta(days=THRESHOLD_DAYS)

    latest_observations = (
        db.query(Observation.student_id, func.max(Observation.created_at).label("latest_observation"))
        .group_by(Observation.student_id)
        .all()
    )

    latest_obs_dict = {obs.student_id: obs.latest_observation for obs in latest_observations}

    all_students = db.query(Student).all()

    falling_behind_students = [
        {
            "student_id": student.student_id,
            "student_name": f"{student.first_name} {student.last_name}",
            "last_observation": latest_obs_dict.get(student.student_id, "No observations"),
            "status": "Falling behind"
        }
        for student in all_students
        if latest_obs_dict.get(student.student_id, datetime.min) < threshold_date
    ]

    return {"falling_behind_students": falling_behind_students}
