# app/services/auth.py
from datetime import datetime, timedelta
from jose import JWTError, jwt
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from typing import Annotated, Optional
from sqlalchemy.orm import Session
from app.models.schemas import TokenData, UserPublic, UserInDB
from app.db.database import get_db
from app.db import crud as db_crud

SECRET_KEY = "your-super-secret-key"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="api/v1/token")
pwd_context = db_crud.pwd_context # Reuse context from CRUD to avoid circular import

def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    to_encode = data.copy()
    expire = datetime.utcnow() + (expires_delta or timedelta(minutes=15))
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

async def get_user(username: str, db: Session = Depends(get_db)) -> Optional[UserInDB]:
    db_user = db_crud.get_user_by_username(db, username)
    if db_user:
        return UserInDB(
            id=db_user.id, username=db_user.email, role=db_user.role.value,
            hashed_password=db_user.hashed_password, full_name=f"{db_user.first_name} {db_user.last_name}"
        )
    return None

# async def get_current_user(token: Annotated[str, Depends(oauth2_scheme)], db: Session = Depends(get_db)) -> UserPublic:
#     try:
#         payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
#         username: str = payload.get("sub")
#         if username is None: raise HTTPException(status_code=401)
#         token_data = TokenData(username=username, id=payload.get("id"), role=payload.get("role"))
#     except JWTError:
#         raise HTTPException(status_code=401)
        
#     db_user = db_crud.get_user_by_id(db, token_data.id)
#     if db_user is None: raise HTTPException(status_code=401)
    
#     return UserPublic(
#         id=db_user.id, username=db_user.email, role=db_user.role.value,
#         full_name=f"{db_user.first_name} {db_user.last_name}",
#         branch_id=db_user.branch_id,
#         student_class_id=db_user.student_class_id
#     )
# app/services/auth.py

# ... (Keep imports and setup code)

async def get_current_user(token: Annotated[str, Depends(oauth2_scheme)], db: Session = Depends(get_db)) -> UserPublic:
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username: str = payload.get("sub")
        if username is None: raise HTTPException(status_code=401)
        token_data = TokenData(username=username, id=payload.get("id"), role=payload.get("role"))
    except JWTError:
        raise HTTPException(status_code=401)
        
    db_user = db_crud.get_user_by_id(db, token_data.id)
    if db_user is None: raise HTTPException(status_code=401)
    
    # MAPPING LOGIC: Extract names from relationships
    b_name = db_user.branch.code if db_user.branch else None # Uses "COMPS", "EXTC"
    c_name = db_user.student_class.name if db_user.student_class else None # Uses "TE-COMP-A"

    return UserPublic(
        id=db_user.id, 
        username=db_user.email, 
        role=db_user.role.value,
        full_name=f"{db_user.first_name} {db_user.last_name}",
        
        # Map the new readable fields
        branch_name=b_name,
        class_name=c_name,
        student_id_code=db_user.student_id,
        
        # Keep IDs for reference
        branch_id=db_user.branch_id,
        student_class_id=db_user.student_class_id
    )

# ... (Keep check_role function)

def check_role(required_role: str):
    def role_checker(current_user: Annotated[UserPublic, Depends(get_current_user)]):
        if current_user.role != required_role: raise HTTPException(status_code=403)
        return current_user
    return role_checker