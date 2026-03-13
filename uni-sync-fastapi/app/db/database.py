# app/db/database.py
import os
from dotenv import load_dotenv
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.ext.declarative import declarative_base

# 1. Load environment variables
load_dotenv()

# 2. Get Database URL
SQLALCHEMY_DATABASE_URL = os.getenv("DATABASE_URL")

# If the URL is missing, fail fast so you know to fix .env
if not SQLALCHEMY_DATABASE_URL:
    raise ValueError("DATABASE_URL is not set in the .env file")

# 3. Create Engine
engine = create_engine(
    SQLALCHEMY_DATABASE_URL,
    pool_pre_ping=True, # Helps handle lost connections
)

# 4. Create SessionLocal class (THIS WAS MISSING or misnamed)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# 5. Create Base class
Base = declarative_base()

# 6. Dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()