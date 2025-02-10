import os
from dotenv import load_dotenv
import cohere
from fastapi import APIRouter, Request, Depends, HTTPException
from sqlalchemy.orm import Session
from backend.fastapi.dependencies.database import get_sync_db, Base
from backend.fastapi.schemas.schemas import ObservationMetricCreate
from backend.fastapi.schemas.schemas import ReportEntrySchema
from backend.fastapi.api.v1.endpoints.classroom import get_current_user
from decimal import Decimal


Teacher = Base.classes.teachers
Observation = Base.classes.observations
Student = Base.classes.students
Course = Base.classes.courses
StudentsCourses = Base.classes.student_courses
ObservationMetric = Base.classes.observation_metrics
ReportEntry = Base.classes.report_entries
StudentReport = Base.classes.student_reports

router = APIRouter()

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
    metric_data: ObservationMetricCreate,  # Use schema to validate payload
    teacher_id: int = Depends(get_current_user),
    db: Session = Depends(get_sync_db)
):
    metric_name = metric_data.metric_name
    if not metric_name:
        raise HTTPException(status_code=400, detail="Metric name is required")

    # Check if course exists and is taught by the logged-in teacher
    course = db.query(Course).filter(Course.course_id == course_id, Course.teacher_id == teacher_id).first()
    if not course:
        raise HTTPException(status_code=404, detail="Course not found or not taught by you")

    # Check if metric already exists for the course
    existing_metric = db.query(ObservationMetric).filter(
        ObservationMetric.course_id == course_id,
        ObservationMetric.metric_name == metric_name
    ).first()

    if existing_metric:
        raise HTTPException(status_code=400, detail="Metric already exists for this course")

    # Generate description using Cohere AI
    metric_description = generate_metric_description(metric_name)

    # Create a new observation metric record
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



def generate_summary_report(observations: list) -> dict:
    """
    Uses Cohere AI to summarize the observations and give insights on progress over time,
    along with an estimated mark from 0-100.
    """
    observation_texts = [obs.observation_text for obs in observations]
    combined_text = "\n\n".join(observation_texts)

    try:
        # Request Cohere AI to generate both a summary and an estimated mark
        response = co.chat(
            model="command-r",  # Use the correct Cohere model
            message=f"Summarize the following student observations and analyze the progress over time. "
                    f"Provide a constructive critique with an estimated mark (0-100) at the end of the summary. "
                    f"Consider the improvements over time. You are a teacher writing a report for parents:\n{combined_text}",
            temperature=0.7
        )
        result = response.text.strip()

        # Extracting the mark from the response (assuming it's formatted at the end of the summary)
        estimated_mark = None
        if result:
            # Assuming that the estimated mark is at the end of the summary, after the word "Mark:"
            if "Mark:" in result:
                try:
                    mark_text = result.split("Mark:")[-1].strip()  # Get the part after "Mark:"
                    estimated_mark = float(mark_text.split()[0])  # Extract the number
                    if estimated_mark < 0:
                        estimated_mark = 0
                    elif estimated_mark > 100:
                        estimated_mark = 100
                except ValueError:
                    pass  # If no valid mark found, keep it None

        return {
            "summary": result,
            "estimated_mark": estimated_mark if estimated_mark is not None else 50  # Default to 50 if no mark
        }
    except Exception as e:
        print(f"Cohere API error: {e}")
        return {"summary": "Summary generation failed", "estimated_mark": 50}  # Default to 50 in case of failure


@router.post("/generate_reports/")
async def generate_reports(
    db: Session = Depends(get_sync_db),
    teacher_id: int = Depends(get_current_user)
):
    # Step 1: Fetch all students and their courses
    students = db.query(Student).all()

    if not students:
        raise HTTPException(status_code=404, detail="No students found")

    # Step 2: Iterate over each student
    for student in students:
        # Step 2.1: Create a new student report (no need to pass `created_at` as it's auto-generated)
        student_report = StudentReport(student_id=student.student_id)
        db.add(student_report)
        db.commit()
        db.refresh(student_report)

        # Step 3: Fetch all observations for the student across all courses
        observations = db.query(Observation).filter(Observation.student_id == student.student_id).all()

        if not observations:
            continue  # Skip if no observations for the student

        # Step 4: Group observations by course_id and metric_id
        grouped_observations = {}

        for observation in observations:
            course_id = observation.course_id
            metric_id = observation.metric_id

            if course_id not in grouped_observations:
                grouped_observations[course_id] = {}

            if metric_id not in grouped_observations[course_id]:
                grouped_observations[course_id][metric_id] = []

            grouped_observations[course_id][metric_id].append(observation)

        # Step 5: Generate summaries for each course and metric for the student
        for course_id, metrics in grouped_observations.items():
            course = db.query(Course).filter(Course.course_id == course_id).first()
            if not course:
                continue  # Skip if course not found

            for metric_id, observations in metrics.items():
                metric = db.query(ObservationMetric).filter(ObservationMetric.metric_id == metric_id).first()
                if not metric:
                    continue  # Skip if metric not found

                # Sort observations by creation date to analyze progress
                observations_sorted = sorted(observations, key=lambda x: x.created_at)

                # Generate a summary of the progress and estimated mark using Cohere AI
                summary_data = generate_summary_report(observations_sorted)
                metric_summary = summary_data['summary']
                estimated_mark = summary_data['estimated_mark']

                # Step 6: Check if the report entry already exists for the student and course
                existing_report_entry = db.query(ReportEntry).filter(
                    ReportEntry.report_id == student_report.report_id,
                    ReportEntry.course_id == course_id
                ).first()

                if not existing_report_entry:
                    # Create a new report entry if it doesn't exist
                    new_report_entry = ReportEntry(
                        report_id=student_report.report_id,  # Linking to student_report
                        teacher_id=teacher_id,
                        course_id=course_id,
                        marks=Decimal(estimated_mark),  # Use the estimated mark
                        comments=metric_summary,
                    )
                    db.add(new_report_entry)
                    db.commit()
                    db.refresh(new_report_entry)

                    # Return the created report entry using ReportEntrySchema for proper serialization
                    return ReportEntrySchema.model_validate(new_report_entry)

    return {"message": "Reports generated and saved successfully"}
