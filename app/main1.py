from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware # <--- IMPORT THIS
from app.routers import user, announcements, academic, attendance
from app.db.database import engine, Base

app = FastAPI(title="College Portal API", version="1.0.0")

# --- ADD THIS BLOCK ---
# This tells the browser: "Allow requests from ANYWHERE (*)"
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows localhost:5173, localhost:3000, etc.
    allow_credentials=True,
    allow_methods=["*"],  # Allows GET, POST, PUT, DELETE
    allow_headers=["*"],  # Allows Tokens (Authorization header)
)
# ----------------------

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