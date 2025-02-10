from pydantic import BaseModel, EmailStr
from datetime import datetime, date
from typing import Optional, List
from decimal import Decimal

# Teacher schemas
class TeacherCreate(BaseModel):
    first_name: str
    last_name: str
    email: EmailStr
    password: str

class TeacherSchema(TeacherCreate):
    teacher_id: int
    created_at: datetime

    class Config:
        from_attributes = True

# Course schemas
class CourseCreate(BaseModel):
    teacher_id: int
    course_name: str
    course_code: str
    description: Optional[str]
    grade_level: int
    academic_year: str

class CourseSchema(CourseCreate):
    course_id: int
    created_at: datetime

    class Config:
        from_attributes = True

# Student schemas
class StudentCreate(BaseModel):
    first_name: str
    last_name: str
    date_of_birth: date
    grade_level: int

class StudentSchema(StudentCreate):
    student_id: int
    created_at: datetime

    class Config:
        from_attributes = True

# Student Course schemas
class StudentCourseCreate(BaseModel):
    student_id: int
    course_id: int

class StudentCourseSchema(StudentCourseCreate):
    created_at: datetime

    class Config:
        from_attributes = True

# Student Report schemas
class StudentReportCreate(BaseModel):
    student_id: int
    course_id: int
    academic_period: str

class StudentReportSchema(StudentReportCreate):
    report_id: int
    created_at: datetime

    class Config:
        from_attributes = True

# Report Entry schemas
class ReportEntryCreate(BaseModel):
    report_id: int
    teacher_id: int
    course_id: int
    marks: Decimal
    comments: Optional[str]

class ReportEntrySchema(ReportEntryCreate):
    entry_id: int
    created_at: datetime

    class Config:
        from_attributes = True

# Observation Metric schemas
class ObservationMetricCreate(BaseModel):
    course_id: int
    metric_name: str
    description: Optional[str]

class ObservationMetricSchema(ObservationMetricCreate):
    metric_id: int
    created_at: datetime

    class Config:
        from_attributes = True

# Observation schemas
class ObservationCreate(BaseModel):
    student_id: int
    course_id: int
    teacher_id: int
    metric_id: int
    observation_text: str

class ObservationSchema(ObservationCreate):
    observation_id: int
    created_at: datetime

    class Config:
        from_attributes = True

# Observation Attachment schemas
class ObservationAttachmentCreate(BaseModel):
    observation_id: int
    file_name: str
    file_path: str
    file_type: str

class ObservationAttachmentSchema(ObservationAttachmentCreate):
    attachment_id: int
    created_at: datetime

    class Config:
        from_attributes = True

# Response schemas for relationships
class TeacherWithCourses(TeacherSchema):
    courses: List[CourseSchema] = []

class CourseWithStudents(CourseSchema):
    students: List[StudentSchema] = []

class StudentWithCourses(StudentSchema):
    courses: List[CourseSchema] = []

class CourseWithObservations(CourseSchema):
    observations: List[ObservationSchema] = []

class StudentWithObservations(StudentSchema):
    observations: List[ObservationSchema] = []

# Error response schema
class ErrorResponse(BaseModel):
    detail: str

# Success response schema
class SuccessResponse(BaseModel):
    message: str

class ObservationUpdate(BaseModel):
    metric_id: Optional[int] = None
    observation_text: Optional[str] = None

    class Config:
        from_attributes = True