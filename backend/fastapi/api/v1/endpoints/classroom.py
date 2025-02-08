from fastapi import APIRouter, Request, Depends, HTTPException
from sqlalchemy.orm import Session
from backend.fastapi.dependencies.database import get_sync_db, Base
from backend.fastapi.schemas.schemas import ObservationCreate, ObservationSchema, ObservationUpdate

Teacher = Base.classes.teachers  
Observation = Base.classes.observations
Student = Base.classes.students
Course = Base.classes.courses



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



# Gets all observations corresponding to the teacher logged in
@router.get("/observations/")
async def get_observations_for_teacher(
    teacher_id: int = Depends(get_current_user), 
    db: Session = Depends(get_sync_db)
):
    # Fetch observations linked to the authenticated teacher
    observations = db.query(Observation).filter(Observation.teacher_id == teacher_id).all()
    # If there are no observations, return an empty list instead of None
    observation_ids = [obs.observation_id for obs in observations] if observations else []

    return {"observations": observation_ids}

# Creates an observation ** will have to add an additional rating system, rather than only text
@router.post("/observations/")
async def create_observation(
    observation_data: ObservationCreate,
    teacher_id: int = Depends(get_current_user), 
    db: Session = Depends(get_sync_db)
):
    # Check if course exists
    course = db.query(Course).filter(Course.course_id == observation_data.course_id).first()
    if not course:
        raise HTTPException(status_code=404, detail="Course not found")

    # Check if student exists
    student = db.query(Student).filter(Student.student_id == observation_data.student_id).first()
    if not student:
        raise HTTPException(status_code=404, detail="Student not found")
    
    # Create a new Observation record
    new_observation = Observation(
        teacher_id=teacher_id,
        course_id=observation_data.course_id,
        student_id=observation_data.student_id,
        metric_id = observation_data.metric_id,
        observation_text= observation_data.observation_text
    )

    db.add(new_observation)
    db.commit()
    db.refresh(new_observation)

    return {"message": "Observation recorded", "observation_id": new_observation.observation_id}



# Update an existing observation
@router.put("/observations/{observation_id}")
async def update_observation(
    observation_id: int,
    observation_data: ObservationUpdate,
    teacher_id: int = Depends(get_current_user),  
    db: Session = Depends(get_sync_db)
):
    # Check if the observation exists
    observation = db.query(Observation).filter(Observation.observation_id == observation_id).first()
    if not observation:
        raise HTTPException(status_code=404, detail="Observation not found")

    # Ensure the teacher owns this observation
    if observation.teacher_id != teacher_id:
        raise HTTPException(status_code=403, detail="Not authorized to update this observation")

    # Update only the fields that were provided in the request
    if observation_data.metric_id is not None:
        observation.metric_id = observation_data.metric_id
    if observation_data.observation_text is not None:
        observation.observation_text = observation_data.observation_text

    db.commit()
    db.refresh(observation)

    return {"message": "Observation updated successfully", "observation_id": observation.observation_id}

