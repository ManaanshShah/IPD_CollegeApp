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

class ExamType(str, enum.Enum):
    MIDTERM_1 = "midterm_1"
    MIDTERM_2 = "midterm_2"
    END_SEM = "end_sem"

# --- 1. STRUCTURE: BRANCHES & CLASSES ---
class Branch(Base):
    __tablename__ = "branches"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True, nullable=False)
    code = Column(String, unique=True, nullable=False)
    classes = relationship("StudentClass", back_populates="branch")
    users = relationship("User", back_populates="branch")

class StudentClass(Base):
    __tablename__ = "student_classes"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False) 
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
    student_id = Column(String, unique=True, nullable=True)
    branch_id = Column(Integer, ForeignKey("branches.id"), nullable=True)
    student_class_id = Column(Integer, ForeignKey("student_classes.id"), nullable=True)
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
    __tablename__ = "timetable_entries"
    id = Column(Integer, primary_key=True, index=True)
    course_id = Column(Integer, ForeignKey("courses.id"))
    student_class_id = Column(Integer, ForeignKey("student_classes.id")) 
    day_of_week = Column(Integer) 
    start_time = Column(String)
    end_time = Column(String)
    room_number = Column(String)
    course = relationship("Course", back_populates="timetables")
    student_class = relationship("StudentClass", back_populates="timetable_entries")

# --- 4. GRADES, EVENTS, ATTENDANCE ---
class Grade(Base):
    __tablename__ = "grades"
    id = Column(Integer, primary_key=True, index=True)
    student_id = Column(Integer, ForeignKey("users.id"))
    course_id = Column(Integer, ForeignKey("courses.id")) # <--- Bringing this back!
    exam_type = Column(Enum(ExamType))                    # <--- Bringing this back!
    marks_obtained = Column(Integer)                      # <--- Bringing this back!
    max_marks = Column(Integer, default=100)
    student = relationship("User")
    course = relationship("Course")                       # <--- Bringing this back!
    
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