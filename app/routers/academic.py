# app/routers/academic.py
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy.orm.attributes import flag_modified 
from typing import List, Annotated, Dict
from datetime import datetime

from app.services.auth import get_current_user
from app.db.database import get_db
from app.db import crud as db_crud
from app.db import models
from app.db.models import AttendanceStatus, UserRole
from app.models import schemas
from app.models.schemas import (
    StudentMarks, GradeItem, TimetableSlot, UserPublic, 
    BranchOut, ClassOut, AttendanceSubmit, CourseOut
)

router = APIRouter(prefix="/academic", tags=["Academic Data"])
CurrentUserDep = Annotated[UserPublic, Depends(get_current_user)]

# --- 1. GET MARKS (RESTORED) ---
@router.get("/marks/{student_id}", response_model=StudentMarks)
async def get_student_marks(student_id: int, current_user: CurrentUserDep, db: Session = Depends(get_db)):
    if current_user.role == UserRole.STUDENT.value and current_user.id != student_id:
        raise HTTPException(status_code=403, detail="Access Forbidden")
    
    marks = db_crud.get_student_grades(db, student_id)
    if not marks: 
        raise HTTPException(status_code=404, detail="Marks not found")
    
    # FIX: Reverted back to 'marks.courses' because that is what your DB uses
    return StudentMarks(student_id=student_id, grades=marks.courses) 

# --- 2. UPDATE MARKS (FIXED) ---
@router.put("/marks/{student_id}", response_model=StudentMarks)
async def update_student_mark(
    student_id: int, 
    grade_data: GradeItem, 
    current_user: CurrentUserDep, 
    db: Session = Depends(get_db)
):
    """
    Updates the marks for a specific student and subject.
    """
    # 1. Security Check
    if current_user.role == UserRole.STUDENT.value:
        raise HTTPException(status_code=403, detail="Access Forbidden. Students cannot modify grades.")

    # 2. Fetch the DB Record directly
    db_grade = db.query(models.DBGrade).filter(models.DBGrade.student_id == student_id).first()

    # 3. If no record exists, Create it
    if not db_grade:
        # Note: We use 'courses' here because your GET request proved the column is named 'courses'
        new_grades = {grade_data.course_name: grade_data.marks}
        db_grade = models.DBGrade(student_id=student_id, courses=new_grades) 
        db.add(db_grade)
        db.commit()
        db.refresh(db_grade)
        return StudentMarks(student_id=student_id, grades=db_grade.courses)

    # 4. If record exists, UPDATE it safely
    # We use 'courses' here as well to match the database column name
    current_grades = dict(db_grade.courses) if db_grade.courses else {}
    current_grades[grade_data.course_name] = grade_data.marks
    
    # Assign the new dictionary back
    db_grade.courses = current_grades
    
    # CRITICAL FIX: Explicitly flag the 'courses' field as modified
    flag_modified(db_grade, "courses")
    
    db.add(db_grade)
    db.commit()
    db.refresh(db_grade)
    
    return StudentMarks(student_id=student_id, grades=db_grade.courses)

# --- 3. TIMETABLE ---
@router.get("/timetable", response_model=List[TimetableSlot])
async def get_timetable(current_user: CurrentUserDep, db: Session = Depends(get_db)):
    if current_user.role == UserRole.STUDENT.value:
        if not current_user.student_class_id:
             raise HTTPException(status_code=404, detail="Student not assigned to a class.")
        db_timetable = db_crud.get_timetable_by_class(db, current_user.student_class_id)
    else:
        db_timetable = db_crud.get_timetable_by_teacher(db, current_user.id)
    
    return [
        TimetableSlot(
            time=f"{t.start_time} - {t.end_time}",
            mon=t.course.name if t.day_of_week == 1 else None,
            tue=t.course.name if t.day_of_week == 2 else None,
            wed=t.course.name if t.day_of_week == 3 else None,
            thu=t.course.name if t.day_of_week == 4 else None,
            fri=t.course.name if t.day_of_week == 5 else None,
        ) for t in db_timetable if t.day_of_week in range(1, 6)
    ]

# --- 4. DROPDOWNS ---
@router.get("/branches", response_model=List[BranchOut])
async def get_branches(db: Session = Depends(get_db)):
    return db_crud.get_all_branches(db)

@router.get("/classes/{branch_id}", response_model=List[ClassOut])
async def get_classes(branch_id: int, db: Session = Depends(get_db)):
    return db_crud.get_classes_by_branch(db, branch_id)

@router.get("/courses", response_model=List[schemas.CourseOut])
def get_all_courses(db: Session = Depends(get_db)):
    return db.query(models.Course).all()

# --- 5. STUDENTS LIST ---
@router.get("/students/class/{class_id}")
def get_students_by_class(class_id: int, db: Session = Depends(get_db)):
    students = db.query(models.User).filter(
        models.User.student_class_id == class_id
    ).all()
    
    response_data = []
    for s in students:
        response_data.append({
            "id": s.id,
            "full_name": f"{s.first_name} {s.last_name}", 
            "first_name": s.first_name,
            "last_name": s.last_name,
            "student_id_code": s.student_id, 
            "role": s.role
        })
    return response_data

# --- 6. SAVE ATTENDANCE ---
@router.post("/attendance/save")
def save_attendance(data: AttendanceSubmit, db: Session = Depends(get_db)):
    new_session = models.AttendanceSession(
        course_id=data.course_id,
        session_date=datetime.utcnow()
    )
    db.add(new_session)
    db.commit()
    db.refresh(new_session)

    records = []
    for student_id, is_present in data.attendance_data.items():
        records.append(models.AttendanceRecord(
            session_id=new_session.id,
            student_id=student_id,
            status=AttendanceStatus.PRESENT if is_present else AttendanceStatus.ABSENT
        ))
    
    db.add_all(records)
    db.commit()
    return {"message": "Attendance Saved Successfully", "session_id": new_session.id}