from pydantic import BaseModel, EmailStr
from typing import Optional, List
from app.core.models import UserRole # Import the enum from models

# --- Input Schemas (For data validation) ---

class UserBase(BaseModel):
    """Base schema for common user fields."""
    email: EmailStr
    first_name: str
    last_name: str
    role: UserRole = UserRole.STUDENT # Default role for registration

class UserCreate(UserBase):
    """Schema for user registration (includes password)."""
    password: str
    
    # Student specific fields
    student_id: Optional[str] = None
    roll_no: Optional[str] = None
    year: Optional[int] = None

class UserLogin(BaseModel):
    """Schema for user login request."""
    email: EmailStr
    password: str

# --- Output Schemas (For data returned to the client) ---

class UserOut(UserBase):
    """Schema for returning user data (excludes password hash)."""
    id: int
    student_id: Optional[str] = None
    roll_no: Optional[str] = None
    year: Optional[int] = None
    
    class Config:
        # Allows conversion from SQLAlchemy model instances
        from_attributes = True 
        
# --- Schemas for Timetable Feature (Needed by timetable.py) ---

class CourseOut(BaseModel):
    """Schema for returning Course data."""
    id: int
    course_code: str
    name: str
    semester: str
    
    class Config:
        from_attributes = True

class TimetableEntryOut(BaseModel):
    """Schema for returning a single Timetable entry with course details."""
    id: int
    day_of_week: int
    start_time: str
    end_time: str
    room_number: str
    course: CourseOut # Embeds the course details within the timetable entry
    
    class Config:
        from_attributes = True