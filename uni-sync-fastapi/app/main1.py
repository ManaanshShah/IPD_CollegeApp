# app/main1.py
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware 
from fastapi.staticfiles import StaticFiles

from app.routers import user, announcements, academic, attendance
from app.db.database import engine, Base
from app.db import models # <--- 1. ADD THIS IMPORT

app = FastAPI(title="College Portal API", version="1.0.0")

# app/main1.py

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:6173",
        "http://127.0.0.1:6173",
        "https://ipd-college-app.vercel.app", 
        "https://ipd-college-app-manaansh-shahs-projects.vercel.app", # Added a cleaner version
        "https://ipd-college-c0yf9101i-manaansh-shahs-projects.vercel.app"
    ], 
    # This regex is your safety net for all Vercel previews
    allow_origin_regex=r"https://.*\.vercel\.app",
    allow_credentials=True,
    allow_methods=["*"],  
    allow_headers=["*"],
    expose_headers=["*"], # Added this to help the browser "see" everything
)

@app.on_event("startup")
def startup_event():
    Base.metadata.create_all(bind=engine)

app.include_router(user.router, prefix="/api/v1")
app.include_router(announcements.router, prefix="/api/v1")
app.include_router(academic.router, prefix="/api/v1")
app.include_router(attendance.router, prefix="/api/v1")

# --- 2. ADD THIS TEMPORARY RESET ROUTE ---
@app.get("/reset-grades-table")
def reset_grades_table():
    models.Grade.__table__.drop(engine, checkfirst=True)
    models.Grade.__table__.create(engine, checkfirst=True)
    return {"message": "SUCCESS: The Grades table has been rebuilt!"}
# -----------------------------------------

@app.get("/")
def read_root():
    return {"message": "API is running locally!"}