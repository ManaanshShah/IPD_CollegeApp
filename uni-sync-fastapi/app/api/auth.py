from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.core.models import User, UserRole
from app.core.security import get_password_hash, verify_password, create_access_token, get_current_user
from app.schemas.user import UserCreate, UserOut, UserLogin
from app.schemas.token import Token
from sqlalchemy.exc import IntegrityError
from typing import List

router = APIRouter(
    prefix="/auth",
    tags=["Authentication"],
)

# --- Dependency to get a user by email ---
def get_user_by_email(db: Session, email: str):
    return db.query(User).filter(User.email == email).first()

# --- 1. Student Registration Endpoint ---
@router.post("/register", response_model=UserOut, status_code=status.HTTP_201_CREATED)
def register_user(user: UserCreate, db: Session = Depends(get_db)):
    # Check if email is already registered
    if get_user_by_email(db, user.email):
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Email already registered."
        )
    
    # Check if student_id is provided and unique (only for students)
    if user.student_id:
        if db.query(User).filter(User.student_id == user.student_id).first():
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="Student ID already registered."
            )

    # Hash the password
    hashed_password = get_password_hash(user.password)

    # Create the user model instance
    db_user = User(
        email=user.email,
        hashed_password=hashed_password,
        first_name=user.first_name,
        last_name=user.last_name,
        role=UserRole.STUDENT,  # Default role for /register is always student
        student_id=user.student_id,
        roll_no=user.roll_no,
        year=user.year
    )

    try:
        db.add(db_user)
        db.commit()
        db.refresh(db_user)
        return db_user
    except IntegrityError:
        db.rollback()
        raise HTTPException(status_code=400, detail="Registration failed due to data constraints.")


# --- 2. User Login Endpoint ---
@router.post("/login", response_model=Token)
def login_for_access_token(form_data: UserLogin, db: Session = Depends(get_db)):
    # 1. Check if user exists
    user = get_user_by_email(db, form_data.email)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )

    # 2. Verify password
    if not verify_password(form_data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )

    # 3. Create JWT Token
    access_token = create_access_token(
        data={"user_id": user.id, "role": user.role.value}
    )
    
    return {"access_token": access_token, "token_type": "bearer"}


# --- 3. Protected Route to Fetch Current User Profile ---
@router.get("/me", response_model=UserOut)
def read_users_me(current_user: User = Depends(get_current_user)):
    """
    Returns the profile of the currently logged-in user.
    """
    return current_user