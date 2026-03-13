# app/db/crud.py
from sqlalchemy.orm import Session, joinedload # <--- Added joinedload here
from datetime import datetime
from typing import Optional, List
from sqlalchemy import func
from passlib.context import CryptContext
from app.db import models 
from app.models import schemas
from app.db.models import UserRole, EventType, AttendanceStatus

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# --- USER ---
def get_user_by_username(db: Session, username: str):
    return db.query(models.User).filter(models.User.email == username).first()

def get_user_by_id(db: Session, user_id: int):
    return db.query(models.User).filter(models.User.id == user_id).first()

def create_user(db: Session, email: str, password: str, role: UserRole, first_name: str, last_name: str, student_id: str = None, branch_id: int = None, student_class_id: int = None):
    hashed_password = pwd_context.hash(password)
    db_user = models.User(
        email=email, hashed_password=hashed_password, role=role,
        first_name=first_name, last_name=last_name, student_id=student_id,
        branch_id=branch_id, student_class_id=student_class_id
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

# --- ACADEMIC ---
def get_student_grades(db: Session, student_id: int):
    # Change models.DBGrade -> models.Grade
    return db.query(models.Grade).filter(models.Grade.student_id == student_id).first()

def update_student_grade(db: Session, student_id: int, course_name: str, marks: int):
    # 1. Find the course ID based on the course name
    course = db.query(models.Course).filter(models.Course.name == course_name).first()
    if not course: 
        return None
    
    # 2. Create the grade properly
    new_grade = models.Grade(
        student_id=student_id,
        course_id=course.id,
        exam_type=models.ExamType.MIDTERM_1, 
        marks_obtained=marks,
        max_marks=15
    )
    db.add(new_grade)
    db.commit()
    db.refresh(new_grade)
    return new_grade


def get_timetable_by_class(db: Session, class_id: int):
    """Fetch timetable only for a specific class."""
    return (db.query(models.TimetableEntry)
            .join(models.Course)
            .options(joinedload(models.TimetableEntry.course)) # <--- FIXED: uses joinedload directly
            .filter(models.TimetableEntry.student_class_id == class_id)
            .order_by(models.TimetableEntry.day_of_week, models.TimetableEntry.start_time)
            .all())

def get_all_timetable_entries(db: Session):
    # <--- FIXED: uses joinedload directly
    return db.query(models.TimetableEntry).join(models.Course).options(joinedload(models.TimetableEntry.course)).all()

# app/db/crud.py

def get_timetable_by_teacher(db: Session, teacher_id: int):
    """Fetch timetable entries only for courses taught by this specific teacher."""
    return (db.query(models.TimetableEntry)
            .join(models.Course)
            .options(joinedload(models.TimetableEntry.course))
            .filter(models.Course.teacher_id == teacher_id)  # <--- The Magic Filter
            .order_by(models.TimetableEntry.day_of_week, models.TimetableEntry.start_time)
            .all())
# --- ATTENDANCE ---
def mark_attendance(db: Session, course_id: int, present_student_ids: List[int]):
    """
    1. Marks selected students as PRESENT.
    2. Automatically finds the rest of the class and marks them ABSENT.
    
    Result: EVERY student in the class gets a record. 
    - Present students: Total + 1, Present + 1 (Percentage maintains/increases)
    - Absent students:  Total + 1, Present + 0 (Percentage drops)
    """
    # 1. Create the Session (The Lecture Event)
    new_session = models.AttendanceSession(course_id=course_id, session_date=datetime.utcnow())
    db.add(new_session)
    db.commit()
    db.refresh(new_session)
    
    # Safety Check: If teacher sent an empty list, we can't find the class.
    # In a real app, you might want to pass class_id explicitly, but this works for now.
    if not present_student_ids:
        return 
        
    # 2. Find the Class ID
    # We look at the first student marked present to know which class this is (e.g., TE-COMP-A)
    first_student = db.query(models.User).filter(models.User.id == present_student_ids[0]).first()
    if not first_student: return 
    
    target_class_id = first_student.student_class_id
    
    # 3. Get ALL students in that specific class
    all_students_in_class = db.query(models.User).filter(
        models.User.student_class_id == target_class_id, 
        models.User.role == UserRole.STUDENT
    ).all()
    
    # 4. Calculate who is Absent using Sets
    all_ids = set(s.id for s in all_students_in_class)  # {1, 2, 3, 4}
    present_ids = set(present_student_ids)              # {1, 2}
    absent_ids = all_ids - present_ids                  # {3, 4}
    
    # 5. Create Database Records
    records = []
    
    # A. Add Present Records
    for s_id in present_ids:
        records.append(models.AttendanceRecord(
            session_id=new_session.id, 
            student_id=s_id, 
            status=AttendanceStatus.PRESENT
        ))
    
    # B. Add Absent Records (Crucial Step!)
    for s_id in absent_ids:
        records.append(models.AttendanceRecord(
            session_id=new_session.id, 
            student_id=s_id, 
            status=AttendanceStatus.ABSENT 
        ))

    db.add_all(records)
    db.commit()

def get_student_attendance_stats(db: Session, student_id: int):
    records = db.query(models.AttendanceRecord).filter(models.AttendanceRecord.student_id == student_id).all()
    stats = {}
    for record in records:
        c_name = record.session.course.name
        if c_name not in stats: stats[c_name] = {"total": 0, "present": 0}
        stats[c_name]["total"] += 1
        if record.status == AttendanceStatus.PRESENT: stats[c_name]["present"] += 1
    
    return [schemas.AttendanceStats(course_name=k, total_sessions=v["total"], present_sessions=v["present"], attendance_percentage=(v["present"]/v["total"]*100)) for k,v in stats.items()]

# --- EVENTS ---
def get_all_events(db: Session):
    return db.query(models.Event).order_by(models.Event.start_date.desc()).all()

def create_event(db: Session, event_data: schemas.AnnouncementCreate, posted_by_id: int):
    db_event = models.Event(title=event_data.title, description=event_data.content, event_type=EventType(event_data.category), posted_by_id=posted_by_id, start_date=datetime.utcnow())
    db.add(db_event)
    db.commit()
    db.refresh(db_event)
    return db_event
# --- METADATA CRUD ---
def get_all_branches(db: Session):
    return db.query(models.Branch).all()

def get_classes_by_branch(db: Session, branch_id: int):
    return db.query(models.StudentClass).filter(models.StudentClass.branch_id == branch_id).all()

def get_students_by_filters(db: Session, branch_id: Optional[int] = None, class_id: Optional[int] = None):
    query = db.query(models.User).filter(models.User.role == UserRole.STUDENT)
    if branch_id:
        query = query.filter(models.User.branch_id == branch_id)
    if class_id:
        query = query.filter(models.User.student_class_id == class_id)
    return query.all()