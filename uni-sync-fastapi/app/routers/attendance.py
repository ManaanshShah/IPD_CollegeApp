# app/routers/attendance.py
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Annotated
from app.models.schemas import AttendanceCreate, AttendanceStats, UserPublic
from app.services.auth import check_role, get_current_user
from app.db.database import get_db
from app.db import crud as db_crud
from app.db.models import UserRole

router = APIRouter(prefix="/attendance", tags=["Attendance"])
CurrentUserDep = Annotated[UserPublic, Depends(get_current_user)]

@router.post("/mark", status_code=status.HTTP_201_CREATED)
async def mark_class_attendance(
    attendance_data: AttendanceCreate,
    current_user: Annotated[UserPublic, Depends(check_role(UserRole.FACULTY.value))],
    db: Session = Depends(get_db)
):
    db_crud.mark_attendance(db, attendance_data.course_id, attendance_data.student_ids)
    return {"message": "Attendance recorded successfully"}

@router.get("/my-stats", response_model=List[AttendanceStats])
async def get_my_attendance(current_user: CurrentUserDep, db: Session = Depends(get_db)):
    if current_user.role != UserRole.STUDENT.value:
         raise HTTPException(status_code=400, detail="Only students have attendance stats.")
    return db_crud.get_student_attendance_stats(db, current_user.id)