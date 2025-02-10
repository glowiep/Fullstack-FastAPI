import os
import cohere
from fastapi import APIRouter, Request, Depends, HTTPException
from sqlalchemy.orm import Session
from backend.fastapi.dependencies.database import get_sync_db, Base

Teacher = Base.classes.teachers  
Observation = Base.classes.observations
Student = Base.classes.students
Course = Base.classes.courses
StudentsCourses = Base.classes.student_courses
ObservationMetric = Base.classes.observation_metrics

router = APIRouter()

def get_current_user(request: Request):
    if not request.session.get("authenticated"):
        raise HTTPException(status_code=401, detail="Unauthorized")

    teacher_id = request.session.get("teacher_id")  # Retrieve teacher_id from session
    if not teacher_id:
        raise HTTPException(status_code=401, detail="Unauthorized - No teacher_id in session")
    
    return teacher_id  # Return the teacher_id

# Initialize Cohere client
api_key = os.getenv("COHERE_API_KEY")
co = cohere.Client(api_key)  # Set your API key in environment variables

def generate_metric_description(metric_name: str) -> str:
    """
    Uses Cohere AI to generate a description based on the metric name.
    """
    try:
        response = co.chat(
            model="command-r",  # Use the correct Cohere model
            message=f"Generate a short description for this observation metric: {metric_name}",
            temperature=0.5
        )
        return response.text.strip() if response.text else "No description generated"
    except Exception as e:
        print(f"Cohere API error: {e}")
        return "Description could not be generated"

@router.post("/{course_id}/metric/")
async def add_observation_metric(
    course_id: int,
    metric_data: dict,
    teacher_id: int = Depends(get_current_user),  
    db: Session = Depends(get_sync_db)
):
    metric_name = metric_data.get("metric_name")
    if not metric_name:
        raise HTTPException(status_code=400, detail="Metric name is required")

    # Check if course exists and is taught by the logged-in teacher
    course = db.query(Course).filter(Course.course_id == course_id, Course.teacher_id == teacher_id).first()
    if not course:
        raise HTTPException(status_code=404, detail="Course not found or not taught by you")

    # Check if metric already exists
    existing_metric = db.query(ObservationMetric).filter(
        ObservationMetric.course_id == course_id,
        ObservationMetric.metric_name == metric_name
    ).first()
    
    if existing_metric:
        raise HTTPException(status_code=400, detail="Metric already exists for this course")

    # Generate description using Cohere AI
    metric_description = generate_metric_description(metric_name)

    # Create new metric record
    new_metric = ObservationMetric(
        course_id=course_id,
        metric_name=metric_name,
        description=metric_description
    )

    db.add(new_metric)
    db.commit()
    db.refresh(new_metric)

    return {
        "message": "Observation metric added successfully",
        "metric": {
            "metric_id": new_metric.metric_id,
            "metric_name": new_metric.metric_name,
            "description": new_metric.description,
            "course_id": new_metric.course_id
        }
    }



