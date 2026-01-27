# app/init_db.py
from sqlalchemy import text
from app.db.database import SessionLocal, engine, Base
from app.db import crud as db_crud, models
from app.db.models import UserRole

def reset_database():
    """Forces a complete wipe of the database using CASCADE."""
    with engine.connect() as connection:
        with connection.begin():
            connection.execute(text("DROP SCHEMA public CASCADE;"))
            connection.execute(text("CREATE SCHEMA public;"))
            connection.execute(text("GRANT ALL ON SCHEMA public TO postgres;"))
            connection.execute(text("GRANT ALL ON SCHEMA public TO public;"))
    print("🗑️  Database wiped.")

def init():
    reset_database()
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    print("🌱 Initializing Structure...")

    # 1. Branch & Class
    comp_dept = models.Branch(name="Computer Engineering", code="COMP")
    db.add(comp_dept)
    db.commit()
    
    se_a = models.StudentClass(name="SE-COMP-A", branch_id=comp_dept.id)
    db.add(se_a)
    db.commit()

    # 2. Course
    course = models.Course(course_code="CS101", name="Python Programming")
    db.add(course)
    db.commit()

    # 3. Users with Connections
    print("👤 Creating Users...")
    teacher = db_crud.create_user(db, email="teacher201@uni.edu", password="t_pass", role=UserRole.FACULTY, first_name="Dr. Bob", last_name="Faculty", branch_id=comp_dept.id)
    student = db_crud.create_user(db, email="student101@uni.edu", password="s_pass", role=UserRole.STUDENT, first_name="Alice", last_name="Student", student_id="S101", branch_id=comp_dept.id, student_class_id=se_a.id)

    # 4. Timetable Linked to Class A
    print("📅 Creating Timetable...")
    db.add(models.TimetableEntry(course_id=course.id, student_class_id=se_a.id, day_of_week=1, start_time="09:00", end_time="10:00", room_number="Lab 1"))
    db.commit()

    print("✅ Database Reset & Initialized!")
    db.close()

if __name__ == "__main__":
    init()