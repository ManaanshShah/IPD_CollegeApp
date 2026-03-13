import os
from dotenv import load_dotenv
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.ext.declarative import declarative_base

# Load environment variables from .env file
load_dotenv()

# The database URL is read from the .env file
SQLALCHEMY_DATABASE_URL = os.getenv("DATABASE_URL")

# Create the SQLAlchemy engine
# pool_pre_ping=True ensures connections are still valid
engine = create_engine(
    SQLALCHEMY_DATABASE_URL,
    pool_pre_ping=True,
)

# Configure SessionLocal to create database sessions
# autocommit=False means transactions must be explicitly committed/rolled back
# autoflush=False prevents premature flushing of pending changes
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Base class for our SQLAlchemy models
Base = declarative_base()

# Dependency to get a database session for a single request
# This function is used by FastAPI's dependency injection system
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
