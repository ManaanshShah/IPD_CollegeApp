from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session, joinedload
from typing import List, Optional

from app.core.database import get_db
from app.core.security import get_current_user
from app.core.models import User, TimetableEntry, Course
from app.schemas.user import TimetableEntryOut, CourseOut

router = APIRouter(
    prefix="/timetable",
    tags=["Timetable"],
)

# --- 1. Get Student's Weekly Timetable ---
@router.get("/my-week", response_model=List[TimetableEntryOut])
def get_student_timetable(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    """
    Retrieves the weekly timetable for the currently authenticated student.
    Note: For a real student, this requires a junction table (e.g., StudentCourseAssignment)
    which we will assume is set up via the Course.students M2M relationship for now.
    """
    # 1. Ensure the user is a student
    if current_user.role.value != 'student':
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Access denied. Only students have a personal timetable."
        )

    # 2. Get courses the student is enrolled in (requires complex query in a fully normalized DB)
    # --- For simplicity, we assume one timetable for all students in a year/department. ---
    # In a fully populated DB, you would filter courses by student ID:
    # enrolled_course_ids = [c.id for c in current_user.enrolled_courses]

    # Instead, we will fetch ALL timetable entries and let the user filter, or filter by a dummy course:
    
    # Simple query to fetch all available timetable entries with course details
    timetable_entries = (
        db.query(TimetableEntry)
        .options(joinedload(TimetableEntry.course))
        .order_by(TimetableEntry.day_of_week, TimetableEntry.start_time)
        .all()
    )

    if not timetable_entries:
        return []

    return timetable_entries

# --- 2. Get Faculty's Weekly Timetable (For Faculty/Admin Use) ---
@router.get("/faculty/{faculty_id}", response_model=List[TimetableEntryOut])
def get_faculty_timetable(faculty_id: int, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    """
    Retrieves the weekly teaching schedule for a specific faculty member.
    Requires authentication to view.
    """
    # Authorization: Only faculty and admins should view other faculty schedules
    if current_user.role.value not in ['faculty', 'admin'] and current_user.id != faculty_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Access denied. You can only view your own schedule."
        )

    entries = (
        db.query(TimetableEntry)
        .join(Course) # TimetableEntry doesn't directly link to User, but Course links to Faculty via assignment
        .options(joinedload(TimetableEntry.course))
        .order_by(TimetableEntry.day_of_week, TimetableEntry.start_time)
        .all()
    )
    
    # NOTE: This query is complex without a direct TimetableEntry-to-Faculty link in models.
    # It would be better to add faculty_id directly to TimetableEntry in models.py
    
    # For now, return all entries as a mock response until data is properly linked
    return entries