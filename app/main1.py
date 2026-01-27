# app/main1.py
from fastapi import FastAPI
from app.routers import user, announcements, academic, attendance
from app.db.database import engine, Base

app = FastAPI(title="College Portal API", version="1.0.0")

@app.on_event("startup")
def startup_event():
    Base.metadata.create_all(bind=engine)

app.include_router(user.router, prefix="/api/v1")
app.include_router(announcements.router, prefix="/api/v1")
app.include_router(academic.router, prefix="/api/v1")
app.include_router(attendance.router, prefix="/api/v1")

@app.get("/")
def read_root():
    return {"message": "API is running!"}