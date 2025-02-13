from fastapi import APIRouter, Request, Depends, HTTPException
from sqlalchemy.orm import Session
from backend.fastapi.dependencies.database import get_sync_db, Base
from backend.fastapi.schemas.schemas import ObservationCreate, ObservationSchema, ObservationUpdate

from sqlalchemy import desc, func

Teacher = Base.classes.teachers  
Observation = Base.classes.observations
Student = Base.classes.students
Course = Base.classes.courses
StudentsCourses = Base.classes.student_courses
ObservationMetric = Base.classes.observation_metrics
ReportEntry = Base.classes.report_entries
StudentReport = Base.classes.student_reports



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

# Gets all students based on course that the Teacher is designated to
@router.get("/{course_id}/students")
async def get_students_by_course(
    course_id: int,
    teacher_id: int = Depends(get_current_user),  
    db: Session = Depends(get_sync_db)
):
    # Check if course exists and is taught by the authenticated teacher
    course = db.query(Course).filter(Course.course_id == course_id, Course.teacher_id == teacher_id).first()
    if not course:
        raise HTTPException(status_code=404, detail="Course not found or not taught by you")

    # Get all students in the course via the students_courses association table
    students = (
        db.query(Student)
        .join(StudentsCourses, Student.student_id == StudentsCourses.student_id)
        .filter(StudentsCourses.course_id == course_id)
        .all()
    )

    # if not students:
    #     raise HTTPException(status_code=404, detail="No students found for this course")

    # Format response as JSON
    students_list = [{"student_id": s.student_id, "name": s.name, "email": s.email} for s in students]

    return {"course_id": course_id, "students": students_list}

# Gets all observations_ids corresponding to the teacher logged in
@router.get("/observation/")
async def get_observations_for_teacher(
    teacher_id: int = Depends(get_current_user), 
    db: Session = Depends(get_sync_db)
):
    # Fetch observations linked to the authenticated teacher
    observations = db.query(Observation).filter(Observation.teacher_id == teacher_id).all()
    # If there are no observations, return an empty list instead of None
    observation_ids = [obs.observation_id for obs in observations] if observations else []

    return {"observations": observation_ids}


@router.get("/observations_data/")
async def get_observations_for_teacher(
    teacher_id: int = Depends(get_current_user), 
    db: Session = Depends(get_sync_db)
):
    """
    Fetches all observations for the authenticated teacher along with
    - observation_id
    - observation_text
    - created_at
    - metric_name (from Metric table)
    - student first_name & last name (from Student table)
    """

    # Fetch observations linked to the authenticated teacher
    observations = (
        db.query(
            Observation.observation_id,
            Observation.observation_text,
            Observation.created_at,
            ObservationMetric.metric_name,
            Student.first_name,
            Student.last_name
        )
        .join(ObservationMetric, Observation.metric_id == ObservationMetric.metric_id)  # Join with Metric table
        .join(Student, Observation.student_id == Student.student_id)  # Join with Student table
        .filter(Observation.teacher_id == teacher_id)
        .all()
    )

    # Convert result to a list of dictionaries
    formatted_observations = [
        {
            "observation_id": obs.observation_id,
            "observation_text": obs.observation_text,
            "created_at": obs.created_at,
            "metric_name": obs.metric_name,
            "student_name": f"{obs.first_name} {obs.last_name}"
        }
        for obs in observations
    ]

    return {"observations": formatted_observations}


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


@router.post("/courses/{course_id}/observations/")
async def create_observation(
    course_id: int,
    observation_data: ObservationCreate,  # Use schema for payload validation
    teacher_id: int = Depends(get_current_user),  # Get the logged-in teacher's ID
    db: Session = Depends(get_sync_db)
):
    # Check if the course exists and belongs to the logged-in teacher
    course = db.query(Course).filter(Course.course_id == course_id, Course.teacher_id == teacher_id).first()
    if not course:
        raise HTTPException(status_code=404, detail="Course not found or you don't teach this course")

    # Check if the observation metric exists for the course
    metric = db.query(ObservationMetric).filter(ObservationMetric.metric_id == observation_data.metric_id, ObservationMetric.course_id == course_id).first()
    if not metric:
        raise HTTPException(status_code=404, detail="Metric not found for this course")

    # Check if the student exists and is enrolled in the course
    student = db.query(Student).filter(Student.student_id == observation_data.student_id).first()
    if not student:
        raise HTTPException(status_code=404, detail="Student not found")

    # Check if the student is enrolled in the given course
    student_course = db.query(StudentsCourses).filter(
        StudentsCourses.student_id == observation_data.student_id,
        StudentsCourses.course_id == course_id
    ).first()

    if not student_course:
        raise HTTPException(status_code=404, detail="Student is not enrolled in this course")

    # Create the observation
    new_observation = Observation(
        teacher_id=teacher_id,
        course_id=course_id,
        student_id=observation_data.student_id,
        metric_id=observation_data.metric_id,
        observation_text=observation_data.observation_text
    )

    db.add(new_observation)
    db.commit()
    db.refresh(new_observation)

    return {
        "message": "Observation created successfully",
        "observation": {
            "observation_id": new_observation.observation_id,
            "metric_id": new_observation.metric_id,
            "student_id": new_observation.student_id,
            "observation_text": new_observation.observation_text,
            "course_id": new_observation.course_id
        }
    }


@router.get("/{course_id}/reports/")
async def get_latest_reports_by_course(
    course_id: int,
    db: Session = Depends(get_sync_db)
):
    """
    Retrieves the latest report entry for each student in a given course.
    """

    # Subquery to get the latest report_id for each student in the given course
    latest_reports_subquery = (
        db.query(
            StudentReport.student_id,
            func.max(StudentReport.created_at).label("latest_created_at")
        )
        .join(ReportEntry, StudentReport.report_id == ReportEntry.report_id)
        .filter(ReportEntry.course_id == course_id)
        .group_by(StudentReport.student_id)
        .subquery()
    )

    # Query to get the latest report entries using the subquery
    latest_reports = (
        db.query(
            StudentReport.report_id,
            StudentReport.student_id,
            Student.first_name,
            Student.last_name,
            ReportEntry.course_id,
            Course.course_name,
            ReportEntry.comments.label("latest_feedback"),
            ReportEntry.created_at
        )
        .join(latest_reports_subquery, 
              (StudentReport.student_id == latest_reports_subquery.c.student_id) &
              (StudentReport.created_at == latest_reports_subquery.c.latest_created_at))
        .join(Student, Student.student_id == StudentReport.student_id)
        .join(ReportEntry, StudentReport.report_id == ReportEntry.report_id)
        .join(Course, ReportEntry.course_id == Course.course_id)
        .filter(ReportEntry.course_id == course_id)
        .order_by(desc(ReportEntry.created_at))
        .all()
    )

    if not latest_reports:
        raise HTTPException(status_code=404, detail="No reports found for this course")

    # Format response
    formatted_reports = [
        {
            "report_id": report.report_id,
            "student_id": report.student_id,
            "student_name": f"{report.first_name} {report.last_name}",
            "course_id": report.course_id,
            "course_name": report.course_name,
            "latest_feedback": report.latest_feedback,
            "created_at": report.created_at
        }
        for report in latest_reports
    ]

    return {"latest_reports": formatted_reports}


@router.get("/metrics/")
async def get_metrics_with_observations(
    db: Session = Depends(get_sync_db)
):
    """
    Retrieves all metrics along with their observation count.
    """

    # Query to get metrics with observation count
    metrics_data = (
        db.query(
            ObservationMetric.metric_id,
            ObservationMetric.metric_name,
            ObservationMetric.description,
            func.count(Observation.observation_id).label("num_observations")
        )
        .outerjoin(Observation, ObservationMetric.metric_id == Observation.metric_id)
        .group_by(ObservationMetric.metric_id, ObservationMetric.metric_name, ObservationMetric.description)
        .all()
    )

    if not metrics_data:
        raise HTTPException(status_code=404, detail="No metrics found")

    # Format response
    formatted_metrics = [
        {
            "metric_id": metric.metric_id,
            "metric_name": metric.metric_name,
            "description": metric.description,
            "num_observations": metric.num_observations
        }
        for metric in metrics_data
    ]

    return {"metrics": formatted_metrics}

