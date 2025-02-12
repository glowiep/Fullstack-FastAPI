import os
import smtplib
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from sqlalchemy.orm import Session
from sqlalchemy import desc
from fastapi import APIRouter, Depends, HTTPException
from backend.fastapi.dependencies.database import get_sync_db, Base
from backend.fastapi.api.v1.endpoints.classroom import get_current_user


Student = Base.classes.students
ReportEntry = Base.classes.report_entries
Guardian = Base.classes.guardians
Course = Base.classes.courses
Teacher = Base.classes.teachers
StudentGuardians = Base.classes.student_guardians
StudentReport = Base.classes.student_reports

router = APIRouter()

# SMTP Config (Use Environment Variables)
SMTP_SERVER = os.getenv("SMTP_SERVER", "smtp.gmail.com")
SMTP_PORT = int(os.getenv("SMTP_PORT", 587))
SMTP_USERNAME = os.getenv("SMTP_USERNAME")
SMTP_PASSWORD = os.getenv("SMTP_PASSWORD")  # Consider using an App Password


def send_email(recipient_email, subject, body):
    """
    Sends an email using SMT
    """
    try:
        msg = MIMEMultipart()
        msg["From"] = SMTP_USERNAME
        msg["To"] = recipient_email
        msg["Subject"] = subject
        msg.attach(MIMEText(body, "html"))

        with smtplib.SMTP(SMTP_SERVER, SMTP_PORT) as server:
            server.starttls()
            server.login(SMTP_USERNAME, SMTP_PASSWORD)
            server.sendmail(SMTP_USERNAME, recipient_email, msg.as_string())

        print(f"Email sent to {recipient_email}")
    except Exception as e:
        print(f"Failed to send email to {recipient_email}: {e}")


@router.post("/send_report_cards/")
async def send_report_cards(
    db: Session = Depends(get_sync_db),
    teacher_id: int = Depends(get_current_user)
):
    """
    Sends the latest report entry for each student to their guardians via email.
    """
    # Step 1: Get all students
    students = db.query(Student).all()

    if not students:
        raise HTTPException(status_code=404, detail="No students found")

    sent_reports = []

    for student in students:
        # Step 2: Get the latest student report for the student
        latest_student_report = (
            db.query(StudentReport)
            .filter(StudentReport.student_id == student.student_id)
            .order_by(desc(StudentReport.created_at))
            .first()
        )

        if not latest_student_report:
            continue  # Skip if no student report found

        # Step 3: Get report entries linked to this student report
        latest_report_entry = (
            db.query(ReportEntry)
            .filter(ReportEntry.report_id == latest_student_report.report_id)
            .order_by(desc(ReportEntry.created_at))
            .first()
        )

        if not latest_report_entry:
            continue  # Skip if no report entry found

        # Step 4: Get the student's guardians
        guardian_links = db.query(StudentGuardians).filter(StudentGuardians.student_id == student.student_id).all()
        
        if not guardian_links:
            continue  # Skip if no guardians

        guardians = [
            db.query(Guardian).filter(Guardian.guardian_id == link.guardian_id).first()
            for link in guardian_links
        ]

        if not guardians:
            continue  # No valid guardians found

        # Step 5: Generate an intuitive report card
        student_name = f"{student.first_name} {student.last_name}"
        course = db.query(Course).filter(Course.course_id == latest_report_entry.course_id).first()
        teacher = db.query(Teacher).filter(Teacher.teacher_id == latest_report_entry.teacher_id).first()

        course_name = course.course_name if course else "Unknown Course"
        teacher_name = f"{teacher.first_name} {teacher.last_name}" if teacher else "Unknown Teacher"

        report_card = f"""
        <html>
        <body style="font-family: Arial, sans-serif;">
            <h2 style="color: #2c3e50;">Teacher Feedback</h2>
            <p><strong>Student:</strong> {student_name}</p>
            <p><strong>Course:</strong> {course_name}</p>
            <p><strong>Feedback:</strong> {latest_report_entry.comments}</p>
            <br>
            <p>Best regards,</p>
            <p>{teacher_name}</p>
        </body>
        </html>
        """

        # Step 6: Send the email to all guardians
        for guardian in guardians:
            email_subject = f"Feedback for {student_name}"
            send_email(guardian.email, email_subject, report_card)
            sent_reports.append({"guardian": guardian.email, "student": student_name})

    return {"message": "Report cards sent successfully", "sent_reports": sent_reports}


@router.post("/{student_id}/send_report_card/")
async def send_student_report_card(
    student_id: int,
    db: Session = Depends(get_sync_db),
    teacher_id: int = Depends(get_current_user),
):
    """
    Sends the latest report entry for a specific student to their guardians via email.
    """
    # Step 1: Get the student
    student = db.query(Student).filter(Student.student_id == student_id).first()

    if not student:
        raise HTTPException(status_code=404, detail="Student not found")

    # Step 2: Get the latest student report
    latest_student_report = (
        db.query(StudentReport)
        .filter(StudentReport.student_id == student_id)
        .order_by(desc(StudentReport.created_at))
        .first()
    )

    if not latest_student_report:
        raise HTTPException(status_code=404, detail="No student report found")

    # Step 3: Get the latest report entry
    latest_report_entry = (
        db.query(ReportEntry)
        .filter(ReportEntry.report_id == latest_student_report.report_id)
        .order_by(desc(ReportEntry.created_at))
        .first()
    )

    if not latest_report_entry:
        raise HTTPException(status_code=404, detail="No report entry found")

    # Step 4: Get the student's guardians
    guardian_links = db.query(StudentGuardians).filter(StudentGuardians.student_id == student_id).all()

    if not guardian_links:
        raise HTTPException(status_code=404, detail="No guardians found")

    guardians = [
        db.query(Guardian).filter(Guardian.guardian_id == link.guardian_id).first()
        for link in guardian_links
    ]

    if not guardians:
        raise HTTPException(status_code=404, detail="No valid guardians found")

    # Step 5: Generate an intuitive report card
    student_name = f"{student.first_name} {student.last_name}"
    course = db.query(Course).filter(Course.course_id == latest_report_entry.course_id).first()
    teacher = db.query(Teacher).filter(Teacher.teacher_id == latest_report_entry.teacher_id).first()

    course_name = course.course_name if course else "Unknown Course"
    teacher_name = f"{teacher.first_name} {teacher.last_name}" if teacher else "Unknown Teacher"

    report_card = f"""
    <html>
    <body style="font-family: Arial, sans-serif;">
        <h2 style="color: #2c3e50;">Teacher Feedback</h2>
        <p><strong>Student:</strong> {student_name}</p>
        <p><strong>Course:</strong> {course_name}</p>
        <p><strong>Feedback:</strong> {latest_report_entry.comments}</p>
        <br>
        <p>Best regards,</p>
        <p>{teacher_name}</p>
    </body>
    </html>
    """

    # Step 6: Send the email to all guardians
    sent_reports = []
    for guardian in guardians:
        email_subject = f"Feedback for {student_name}"
        send_email(guardian.email, email_subject, report_card)
        sent_reports.append({"guardian": guardian.email, "student": student_name})

    return {"message": "Report card sent successfully", "sent_reports": sent_reports}