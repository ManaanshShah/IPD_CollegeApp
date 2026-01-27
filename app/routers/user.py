# app/routers/user.py
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from typing import Annotated, List, Optional
from datetime import timedelta
from sqlalchemy.orm import Session

from app.models.schemas import UserLogin, Token, UserInDB, UserPublic
from app.services.auth import (
    ACCESS_TOKEN_EXPIRE_MINUTES, check_role, create_access_token, verify_password, get_user, get_current_user
)
from app.db.database import get_db
from app.db import crud as db_crud
from app.db.models import UserRole

# Note: This router is included in main.py with prefix="/api/v1"
# So the final URL will be /api/v1/students
router = APIRouter(tags=["Authentication & Users"])
CurrentUserDep = Annotated[UserPublic, Depends(get_current_user)]

@router.post("/token", response_model=Token)
async def login_for_access_token(
    form_data: Annotated[OAuth2PasswordRequestForm, Depends()],
    db: Session = Depends(get_db)
):
    user = await get_user(form_data.username, db)
    if not user or not verify_password(form_data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user.username, "id": user.id, "role": user.role},
        expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}

@router.get("/me", response_model=UserPublic)
async def read_users_me(current_user: CurrentUserDep):
    return current_user

# --- NEW SEARCH ENDPOINT ---
@router.get("/students", response_model=List[UserPublic])
async def get_students_list(
    current_user: Annotated[UserPublic, Depends(check_role(UserRole.FACULTY.value))], 
    db: Session = Depends(get_db), 
    branch_id: Optional[int] = None, 
    class_id: Optional[int] = None
):
    """
    Teacher searches for students using Branch ID and Class ID.
    URL: GET /api/v1/students?branch_id=1&class_id=4
    """
    students = db_crud.get_students_by_filters(db, branch_id, class_id)
    
    # Map to UserPublic schema manually to ensure names are included
    return [
        UserPublic(
            id=s.id,
            username=s.email,
            full_name=f"{s.first_name} {s.last_name}",
            role=s.role.value,
            
            # Extract Names safely
            branch_name=s.branch.code if s.branch else None,
            class_name=s.student_class.name if s.student_class else None,
            student_id_code=s.student_id,
            
            branch_id=s.branch_id,
            student_class_id=s.student_class_id,
        ) for s in students
    ]