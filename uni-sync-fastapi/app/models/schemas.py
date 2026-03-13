# app/models/schemas.py
from pydantic import BaseModel
from typing import Literal, Dict, List, Optional
from datetime import datetime

# --- AUTH ---
class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"

class TokenData(BaseModel):
    username: Optional[str] = None
    role: Optional[Literal["student", "faculty", "admin"]] = None
    id: Optional[int] = None 

class UserBase(BaseModel):
    username: str
    full_name: Optional[str] = None

class UserInDB(UserBase):
    id: int
    role: Literal["student", "faculty", "admin"]
    hashed_password: str

class UserPublic(UserBase):
    id: int
    role: Literal["student", "faculty", "admin"]
    full_name: str
    branch_name: Optional[str] = None 
    class_name: Optional[str] = None  
    branch_id: Optional[int] = None
    student_class_id: Optional[int] = None 
    student_id_code: Optional[str] = None 

    class Config:
        from_attributes = True # Updated to v2 syntax

class UserLogin(BaseModel):
    username: str
    password: str

# --- ACADEMIC ---
class GradeItem(BaseModel):
    course_id: int
    exam_type: Literal["midterm_1", "midterm_2", "end_sem"]
    marks: int

class GradeResponseItem(BaseModel):
    course_name: str
    course_code: str
    marks_obtained: int
    max_marks: int

class StudentGradesResponse(BaseModel):
    midterm_1: List[GradeResponseItem] = []
    midterm_2: List[GradeResponseItem] = []
    end_sem: List[GradeResponseItem] = [] 

class TimetableSlot(BaseModel):
    time: str
    mon: Optional[str] = None
    tue: Optional[str] = None
    wed: Optional[str] = None
    thu: Optional[str] = None
    fri: Optional[str] = None

class TimetableUpdate(BaseModel):
    schedule: List[TimetableSlot]

# --- ATTENDANCE ---
class AttendanceCreate(BaseModel):
    course_id: int
    student_ids: List[int]

class AttendanceStats(BaseModel):
    course_name: str
    total_sessions: int
    present_sessions: int
    attendance_percentage: float

# --- ANNOUNCEMENTS ---
class AnnouncementCreate(BaseModel):
    title: str
    content: str
    category: Literal["announcement", "hackathon", "internship"]

class AnnouncementOut(AnnouncementCreate):
    id: int
    posted_by_id: int
    posted_at: datetime   

# --- METADATA SCHEMAS ---
class BranchOut(BaseModel):
    id: int
    name: str
    code: str
    class Config:
        from_attributes = True

class ClassOut(BaseModel):
    id: int
    name: str
    class Config:
        from_attributes = True

class CourseOut(BaseModel):
    id: int
    name: str
    course_code: str
    class Config:
        from_attributes = True

class AttendanceSubmit(BaseModel):
    class_id: int
    course_id: int
    attendance_data: Dict[int, bool]