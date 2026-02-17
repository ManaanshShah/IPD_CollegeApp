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

# class UserPublic(UserBase):
#     """Public profile sent to frontend."""
#     id: int
#     role: Literal["student", "faculty", "admin"]
#     # CONNECTION: Sending these IDs allows frontend to filter data
#     branch_id: Optional[int] = None
#     student_class_id: Optional[int] = None 
# app/models/schemas.py

# ... (Keep imports and Token/TokenData/UserBase/UserInDB)

class UserPublic(UserBase):
    """Public profile with READABLE names instead of just IDs."""
    id: int
    role: Literal["student", "faculty", "admin"]
    full_name: str
    
    # NEW: Human-readable names
    branch_name: Optional[str] = None # e.g., "COMPS"
    class_name: Optional[str] = None  # e.g., "TE-COMP-A"
    
    # IDs (Optional, good to keep for frontend logic/linking)
    branch_id: Optional[int] = None
    student_class_id: Optional[int] = None 
    student_id_code: Optional[str] = None # Roll No (e.g., "C201")

    class Config:
        orm_mode = True

# ... (Keep the rest of the file the same)

class UserLogin(BaseModel):
    username: str
    password: str

# --- ACADEMIC ---
class GradeItem(BaseModel):
    course_name: str
    marks: int

class StudentMarks(BaseModel):
    student_id: int
    grades: Dict[str, int] 

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
# --- METADATA SCHEMAS (For Dropdowns) ---
class BranchOut(BaseModel):
    id: int
    name: str
    code: str
    class Config:
        orm_mode = True

class ClassOut(BaseModel):
    id: int
    name: str
    class Config:
        orm_mode = True

class CourseOut(BaseModel):
    id: int
    name: str
    course_code: str
    class Config:
        orm_mode = True

# --- NEW: ATTENDANCE SUBMISSION ---
class AttendanceSubmit(BaseModel):
    class_id: int
    course_id: int
    # Dictionary mapping Student ID (int) -> Present/Absent (bool)
    attendance_data: Dict[int, bool]