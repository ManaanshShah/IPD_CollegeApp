# app/db/models.py
from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Enum, JSON
from sqlalchemy.orm import relationship
from datetime import datetime
import enum
from app.db.database import Base

# --- ENUMS ---
class UserRole(str, enum.Enum):
    STUDENT = "student"
    FACULTY = "faculty"
    ADMIN = "admin"

class AttendanceStatus(str, enum.Enum):
    PRESENT = "present"
    ABSENT = "absent"

class EventType(str, enum.Enum):
    HACKATHON = "hackathon"
    INTERNSHIP = "internship"
    ANNOUNCEMENT = "announcement"

# --- 1. STRUCTURE: BRANCHES & CLASSES ---
class Branch(Base):
    """Represents a Department (e.g., Computer Science)."""
    __tablename__ = "branches"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True, nullable=False)
    code = Column(String, unique=True, nullable=False)

    classes = relationship("StudentClass", back_populates="branch")
    users = relationship("User", back_populates="branch")

class StudentClass(Base):
    """Represents a specific batch (e.g., SE-A)."""
    __tablename__ = "student_classes"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False) # e.g., "SE-A"
    branch_id = Column(Integer, ForeignKey("branches.id"))
    
    branch = relationship("Branch", back_populates="classes")
    students = relationship("User", back_populates="student_class")
    timetable_entries = relationship("TimetableEntry", back_populates="student_class")

# --- 2. USERS ---
class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    role = Column(Enum(UserRole), default=UserRole.STUDENT, nullable=False)
    first_name = Column(String, nullable=False)
    last_name = Column(String, nullable=False)

    # Student specific fields
    student_id = Column(String, unique=True, nullable=True)
    
    # CONNECTIONS: User belongs to a Branch and (if student) a Class
    branch_id = Column(Integer, ForeignKey("branches.id"), nullable=True)
    student_class_id = Column(Integer, ForeignKey("student_classes.id"), nullable=True)

    # Relationships
    branch = relationship("Branch", back_populates="users")
    student_class = relationship("StudentClass", back_populates="students")
    posted_events = relationship("Event", back_populates="posted_by")

# --- 3. ACADEMIC & TIMETABLE ---
class Course(Base):
    __tablename__ = "courses"
    id = Column(Integer, primary_key=True, index=True)
    course_code = Column(String, unique=True, index=True)
    name = Column(String)
    
    timetables = relationship("TimetableEntry", back_populates="course")

class TimetableEntry(Base):
    """Defines schedule: Class SE-A has Math on Monday 9am."""
    __tablename__ = "timetable_entries"

    id = Column(Integer, primary_key=True, index=True)
    course_id = Column(Integer, ForeignKey("courses.id"))
    
    # CONNECTION: Timetable is linked to a specific Class
    student_class_id = Column(Integer, ForeignKey("student_classes.id")) 
    
    day_of_week = Column(Integer) # 1=Mon
    start_time = Column(String)
    end_time = Column(String)
    room_number = Column(String)

    course = relationship("Course", back_populates="timetables")
    student_class = relationship("StudentClass", back_populates="timetable_entries")

# --- 4. GRADES, EVENTS, ATTENDANCE ---
class DBGrade(Base):
    __tablename__ = "grades"
    # CONNECTION: Grades linked to Student ID
    student_id = Column(Integer, ForeignKey("users.id"), primary_key=True)
    courses = Column(JSON, default={})

class Event(Base):
    __tablename__ = "events"
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String)
    description = Column(String)
    event_type = Column(Enum(EventType))
    start_date = Column(DateTime, default=datetime.utcnow)
    posted_by_id = Column(Integer, ForeignKey("users.id"))
    posted_by = relationship("User", back_populates="posted_events")

class AttendanceSession(Base):
    __tablename__ = "attendance_sessions"
    id = Column(Integer, primary_key=True)
    course_id = Column(Integer, ForeignKey("courses.id"))
    session_date = Column(DateTime, default=datetime.utcnow)
    
    course = relationship("Course")
    records = relationship("AttendanceRecord", back_populates="session")

class AttendanceRecord(Base):
    __tablename__ = "attendance_records"
    id = Column(Integer, primary_key=True)
    session_id = Column(Integer, ForeignKey("attendance_sessions.id"))
    student_id = Column(Integer, ForeignKey("users.id"))
    status = Column(Enum(AttendanceStatus))
    
    session = relationship("AttendanceSession", back_populates="records")