# app/routers/announcements.py
from fastapi import APIRouter, Depends, HTTPException, status
from typing import List, Annotated
from datetime import datetime

from app.models.schemas import AnnouncementCreate, AnnouncementOut, UserInDB
from app.services.auth import check_role, get_current_user

router = APIRouter(prefix="/announcements", tags=["Announcements & Updates"])
CurrentUserDep = Annotated[UserInDB, Depends(get_current_user)]

# MOCK DB for Announcements
MOCK_ANNOUNCEMENTS_DB = [
    AnnouncementOut(
        id=1, 
        title="Semester Starts", 
        content="Welcome back! Classes start Monday.",
        category="announcement",
        posted_by_id=201,
        posted_at=datetime.utcnow()
    ),
    AnnouncementOut(
        id=2, 
        title="Spring Hackathon", 
        content="Register now for the annual hackathon!",
        category="hackathon",
        posted_by_id=201,
        posted_at=datetime.utcnow()
    ),
]

@router.get("/", response_model=List[AnnouncementOut])
async def get_all_announcements(current_user: CurrentUserDep):
    """Retrieves all announcements and updates for all users."""
    return MOCK_ANNOUNCEMENTS_DB

@router.post("/", response_model=AnnouncementOut, status_code=status.HTTP_201_CREATED)
async def create_announcement(
    announcement: AnnouncementCreate, 
    current_user: Annotated[UserInDB, Depends(check_role("teacher"))]
):
    """
    Allows Teachers and Admins to post new announcements, hackathons, or internships.
    """
    new_id = len(MOCK_ANNOUNCEMENTS_DB) + 1
    new_announcement = AnnouncementOut(
        id=new_id,
        posted_by_id=current_user.id,
        posted_at=datetime.utcnow(),
        **announcement.dict()
    )
    MOCK_ANNOUNCEMENTS_DB.append(new_announcement)
    return new_announcement