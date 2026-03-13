from fastapi import FastAPI
from app.core.database import engine, Base
from app.api import auth, timetable # Import the auth router and prepare for timetable
from dotenv import load_dotenv
import os

# Load environment variables (e.g., SECRET_KEY, DB_URL)
load_dotenv()

# Initialize the main FastAPI application
app = FastAPI(
    title="Uni-Sync API",
    description="Backend for the College Management App (FastAPI + PostgreSQL)",
    version="1.0.0",
)

# --- Database Initialization ---
# Create all tables defined in Base (models.py) in the PostgreSQL database
@app.on_event("startup")
def startup_event():
    # This connects to the DB and creates tables if they don't exist
    Base.metadata.create_all(bind=engine)
    print("Database tables ensured (created if not exist).")

# --- Routers ---
# Include the authentication router under the /api/v1 prefix
app.include_router(auth.router, prefix="/api/v1")

# Include the timetable router (will be fully implemented next)
app.include_router(timetable.router, prefix="/api/v1")


# --- Root Endpoint (Health Check) ---
@app.get("/", tags=["Health"])
def read_root():
    return {"message": "Uni-Sync API is running successfully!"}