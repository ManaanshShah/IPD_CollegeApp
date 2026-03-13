# app/routers/academic.py
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Annotated
from datetime import datetime

from app.services.auth import get_current_user
from app.db.database import get_db
from app.db import crud as db_crud
from app.db import models
from app.db.models import AttendanceStatus, UserRole
from app.models import schemas

router = APIRouter(prefix="/academic", tags=["Academic Data"])
CurrentUserDep = Annotated[schemas.UserPublic, Depends(get_current_user)]

# --- 1. GET MARKS ---
@router.get("/marks/{student_id}", response_model=schemas.StudentGradesResponse)
async def get_student_marks(student_id: int, current_user: CurrentUserDep, db: Session = Depends(get_db)):
    if current_user.role == UserRole.STUDENT.value and current_user.id != student_id:
        raise HTTPException(status_code=403, detail="Access Forbidden")
    
    grades = db.query(models.Grade, models.Course).join(models.Course).filter(models.Grade.student_id == student_id).all()
    response = schemas.StudentGradesResponse()
    
    for grade, course in grades:
        item = schemas.GradeResponseItem(
            course_name=course.name,
            course_code=course.course_code,
            marks_obtained=grade.marks_obtained,
            max_marks=grade.max_marks
        )
        if grade.exam_type == models.ExamType.MIDTERM_1:
            response.midterm_1.append(item)
        elif grade.exam_type == models.ExamType.MIDTERM_2:
            response.midterm_2.append(item)
        elif grade.exam_type == models.ExamType.END_SEM:
            response.end_sem.append(item)
            
    return response

# --- 2. UPDATE SINGLE STUDENT MARK ---
# app/routers/academic.py

@router.put("/marks/{student_id}")
async def update_single_mark(
    student_id: int, 
    grade_data: schemas.GradeItem, 
    current_user: CurrentUserDep, 
    db: Session = Depends(get_db)
):
    if current_user.role == UserRole.STUDENT.value:
        raise HTTPException(status_code=403, detail="Access Forbidden")

    try:
        # 1. Safely convert string to Enum for the database
        exam_enum = models.ExamType(grade_data.exam_type)

        # 2. Check if a grade already exists
        existing_grade = db.query(models.Grade).filter(
            models.Grade.student_id == student_id,
            models.Grade.course_id == grade_data.course_id,
            models.Grade.exam_type == exam_enum
        ).first()

        if existing_grade:
            existing_grade.marks_obtained = grade_data.marks
        else:
            max_marks = 15 if "midterm" in grade_data.exam_type else 60
            new_grade = models.Grade(
                student_id=student_id,
                course_id=grade_data.course_id,
                exam_type=exam_enum,
                marks_obtained=grade_data.marks,
                max_marks=max_marks
            )
            db.add(new_grade)
            
        db.commit()
        return {"message": "Grade saved successfully"}
    
    except Exception as e:
        db.rollback()
        print(f"--- DB SAVE ERROR: {str(e)} ---") # Prints exact error to your terminal
        raise HTTPException(status_code=500, detail="Database save failed")

# --- 3. TIMETABLE ---
@router.get("/timetable", response_model=List[schemas.TimetableSlot])
async def get_timetable(current_user: CurrentUserDep, db: Session = Depends(get_db)):
    if current_user.role == UserRole.STUDENT.value:
        if not current_user.student_class_id:
             raise HTTPException(status_code=404, detail="Student not assigned to a class.")
        db_timetable = db_crud.get_timetable_by_class(db, current_user.student_class_id)
    else:
        db_timetable = db_crud.get_timetable_by_teacher(db, current_user.id)
    
    return [
        schemas.TimetableSlot(
            time=f"{t.start_time} - {t.end_time}",
            mon=t.course.name if t.day_of_week == 1 else None,
            tue=t.course.name if t.day_of_week == 2 else None,
            wed=t.course.name if t.day_of_week == 3 else None,
            thu=t.course.name if t.day_of_week == 4 else None,
            fri=t.course.name if t.day_of_week == 5 else None,
        ) for t in db_timetable if t.day_of_week in range(1, 6)
    ]

# --- 4. DROPDOWNS ---
@router.get("/branches", response_model=List[schemas.BranchOut])
async def get_branches(db: Session = Depends(get_db)):
    return db_crud.get_all_branches(db)

@router.get("/classes/{branch_id}", response_model=List[schemas.ClassOut])
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
def save_attendance(data: schemas.AttendanceSubmit, db: Session = Depends(get_db)):
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