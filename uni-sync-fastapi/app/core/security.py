import os
from dotenv import load_dotenv
from datetime import datetime, timedelta
from typing import Any, Union

from jose import jwt, JWTError
from passlib.context import CryptContext
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session

from app.core.models import User
from app.core.database import get_db

# Load environment variables
load_dotenv()

# --- Configuration ---
# CryptContext handles password hashing and verification (using bcrypt algorithm)
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# JWT Configuration pulled from .env
SECRET_KEY = os.getenv("SECRET_KEY")
ALGORITHM = os.getenv("ALGORITHM", "HS256")
ACCESS_TOKEN_EXPIRE_MINUTES = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", 60))

# OAuth2PasswordBearer is a FastAPI dependency used to extract the token from the Authorization header
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="api/v1/login")

# --- Password Hashing Functions ---

def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verifies a plain password against a stored hashed password."""
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password: str) -> str:
    """Returns the bcrypt hash of a plain text password."""
    return pwd_context.hash(password)

# --- JWT Token Functions ---

def create_access_token(data: dict, expires_delta: Union[timedelta, None] = None) -> str:
    """Creates a JWT access token containing user data (like user_id and role)."""
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        # Default expiration time (e.g., 60 minutes)
        expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    
    # Add expiration time and token type to the payload
    to_encode.update({"exp": expire, "sub": "access"})
    
    # Encode the token using the secret key and algorithm
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

# --- Dependency to get the current authenticated user ---

def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    """
    Decodes the JWT token and fetches the corresponding User object from the database.
    This function protects all your API routes.
    """
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        # Decode the token
        payload: dict[str, Any] = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        
        # Extract user ID and role from the token payload
        user_id: int = payload.get("user_id")
        user_role: str = payload.get("role")
        
        if user_id is None or user_role is None:
            raise credentials_exception
    
    except JWTError:
        # Handle expired token or invalid signature
        raise credentials_exception
    
    # Fetch the user from the database
    user = db.query(User).filter(User.id == user_id).first()
    if user is None:
        raise credentials_exception
        
    return user

# Dependency function to check the user's role
def get_current_admin_user(current_user: User = Depends(get_current_user)):
    """Ensures the authenticated user has the 'admin' role."""
    if current_user.role.value != 'admin':
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Operation forbidden: Must be an administrator."
        )
    return current_user

def get_current_faculty_user(current_user: User = Depends(get_current_user)):
    """Ensures the authenticated user has the 'faculty' role."""
    if current_user.role.value != 'faculty' and current_user.role.value != 'admin':
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Operation forbidden: Must be faculty or administrator."
        )
    return current_user
