# app/routers/academic.py
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Annotated
from app.models.schemas import StudentMarks, GradeItem, TimetableSlot, UserPublic, TimetableUpdate
from app.services.auth import check_role, get_current_user
from app.db.database import get_db
from app.db import crud as db_crud
from app.db.models import UserRole
from app.models.schemas import BranchOut, ClassOut

router = APIRouter(prefix="/academic", tags=["Academic Data"])
CurrentUserDep = Annotated[UserPublic, Depends(get_current_user)]

@router.get("/marks/{student_id}", response_model=StudentMarks)
async def get_student_marks(student_id: int, current_user: CurrentUserDep, db: Session = Depends(get_db)):
    if current_user.role == UserRole.STUDENT.value and current_user.id != student_id:
        raise HTTPException(status_code=403, detail="Access Forbidden")
    marks = db_crud.get_student_grades(db, student_id)
    if not marks: raise HTTPException(status_code=404, detail="Marks not found")
    return StudentMarks(student_id=student_id, grades=marks.courses) 

@router.put("/marks/{student_id}", response_model=StudentMarks)
async def update_student_mark(
    student_id: int, 
    grade_item: GradeItem, 
    current_user: Annotated[UserPublic, Depends(check_role(UserRole.FACULTY.value))], 
    db: Session = Depends(get_db)
):
    """
    Teachers can update marks. Fails if the subject is invalid.
    """
    # Pass data to CRUD
    updated_record = db_crud.update_student_grade(
        db, 
        student_id=student_id, 
        course_name=grade_item.course_name, 
        marks=grade_item.marks
    )
    
    # NEW: Check for failure
    if updated_record is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, 
            detail=f"Subject '{grade_item.course_name}' does not exist in the database. Please check the spelling."
        )
    
    return StudentMarks(student_id=student_id, grades=updated_record.courses)

@router.get("/timetable", response_model=List[TimetableSlot])
async def get_timetable(current_user: CurrentUserDep, db: Session = Depends(get_db)):
    if current_user.role == UserRole.STUDENT.value:
        if not current_user.student_class_id:
             raise HTTPException(status_code=404, detail="Student not assigned to a class.")
        db_timetable = db_crud.get_timetable_by_class(db, current_user.student_class_id)
    else:
        db_timetable = db_crud.get_all_timetable_entries(db)
    
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
    
# app/routers/academic.py
@router.get("/branches", response_model=List[BranchOut])
async def get_branches(db: Session = Depends(get_db)):
    """Get list of all branches (COMPS, EXTC, etc.)."""
    return db_crud.get_all_branches(db)

@router.get("/classes/{branch_id}", response_model=List[ClassOut])
async def get_classes(branch_id: int, db: Session = Depends(get_db)):
    """Get list of classes for a specific branch (e.g., SE-COMP-A)."""
    return db_crud.get_classes_by_branch(db, branch_id)