# app/populate_db.py
import random
from datetime import datetime, timedelta
from sqlalchemy import text
from app.db.database import SessionLocal, engine, Base
from app.db import crud as db_crud, models
# Ensure models.Grade exists. If you see 'DBGrade' anywhere in your models.py, 
# you MUST rename that class to 'Grade'.
from app.db.models import UserRole, AttendanceStatus, EventType

# --- CONFIGURATION DATA ---
BRANCH_DATA = [
    ("Computer Science", "COMPS"),
    ("Electronics and Telecom", "EXTC"),
    ("Data Science", "DASC")
]

COURSE_DATA = {
    "COMPS": [("CS304", "IoT"), ("CS305", "DS"), ("CS306", "ADBMS"), ("CS307", "DWM")],
    "EXTC": [("EC301", "VLSI"), ("EC302", "ADCOM"), ("EC303", "WTRF")],
    "DASC": [("DS301", "ML"), ("DS302", "DEVOPS"), ("DS303", "ATCD")]
}

TEACHER_DATA = {
    "COMPS": [("ANIKET.S@uni.edu", "ANIKET", "SIR"), ("LYENTTE.M@uni.edu", "LYENTTE", "MAAM"), ("CHINMAY.S@uni.edu", "CHINMAY", "SIR")],
    "EXTC": [("ROHAN.S@uni.edu", "ROHAN", "SIR"), ("PRASAD.S@uni.edu", "PRASAD", "SIR"), ("KARTIK.S@uni.edu", "KARTIK", "SIR")],
    "DASC": [("SAMEER.S@uni.edu", "SAMEER", "SIR"), ("SHRIDHAR.S@uni.edu", "SHRIDHAR", "SIR"), ("BANSREE.M@uni.edu", "BANSREE", "MAAM")]
}

# FIXED: Added Roll Numbers (Student IDs) as the 4th Element
STUDENT_DATA = [
    ("Manaansh Shah", "TE-COMP-A", "COMPS", "C001"),
    ("Mahip muni", "SE-COMP-B", "COMPS", "C002"),
    ("Neil Gala", "TE-COMP-A", "COMPS", "C003"),
    ("Pooja Dheniya", "TE-ELECS-B", "EXTC", "E001"),
    ("Prayag Katha", "SE-ELECS-A", "EXTC", "E002"),
    ("Dhruvin Shah", "TE-DS-B", "DASC", "D001"),
    ("Jaineel Pandya", "SE-DS-A", "DASC", "D002")
]

def reset_database():
    with engine.connect() as connection:
        with connection.begin():
            connection.execute(text("DROP SCHEMA public CASCADE;"))
            connection.execute(text("CREATE SCHEMA public;"))
            connection.execute(text("GRANT ALL ON SCHEMA public TO postgres;"))
            connection.execute(text("GRANT ALL ON SCHEMA public TO public;"))
    print("🗑️  Database Wiped.")

def init():
    reset_database()
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    print("🌱 Seeding Database with Fixed Data...")

    branch_map, class_map, course_map = {}, {}, {}
    
    # 1. BRANCHES
    for name, code in BRANCH_DATA:
        b = models.Branch(name=name, code=code)
        db.add(b)
        branch_map[code] = b
    db.commit()

    # 2. CLASSES
    unique_classes = sorted(list(set(s[1] for s in STUDENT_DATA)))
    for class_name in unique_classes:
        branch_code = 'COMPS'
        if 'ELECS' in class_name or 'EXTC' in class_name: branch_code = 'EXTC'
        elif 'DS' in class_name: branch_code = 'DASC'
        c = models.StudentClass(name=class_name, branch_id=branch_map[branch_code].id)
        db.add(c)
        class_map[class_name] = c
    db.commit()

    # 3. COURSES
    for b_code, courses in COURSE_DATA.items():
        for code, name in courses:
            c = models.Course(course_code=code, name=name)
            db.add(c)
            course_map[name] = c
    db.commit()
    
    # 4. TEACHERS
    teacher_objects = []
    for branch_code, teachers in TEACHER_DATA.items():
        branch_id = branch_map[branch_code].id
        for email_prefix, first, last in teachers:
            t = db_crud.create_user(db, email_prefix.lower(), "password", UserRole.FACULTY, first, last, branch_id=branch_id)
            teacher_objects.append(t)
    
    # 5. STUDENTS (FIXED LOOP)
    student_objects_map = {}
    for full_name, class_name, branch_code, sid_code in STUDENT_DATA: # Unpack 4 items
        first, last = full_name.split(' ', 1)
        email = f"{first.lower()}@uni.edu"
        
        s = db_crud.create_user(
            db, email=email, password="password", role=UserRole.STUDENT,
            first_name=first, last_name=last,
            branch_id=branch_map[branch_code].id, 
            student_class_id=class_map[class_name].id,
            student_id=sid_code # <--- Passing the Roll No here!
        )
        student_objects_map[first.lower()] = s
    
    # --- 6. TIMETABLE ---
    aniket_sir = teacher_objects[0]
    manaansh = student_objects_map.get("manaansh")
    mahip = student_objects_map.get("mahip")
    pooja = student_objects_map.get("pooja")
    
    if 'TE-COMP-A' in class_map:
        te_comp_a_id = class_map['TE-COMP-A'].id
        db.add_all([
            models.TimetableEntry(course_id=course_map['IoT'].id, student_class_id=te_comp_a_id, day_of_week=1, start_time="09:00", end_time="10:00", room_number="CR-301"),
            models.TimetableEntry(course_id=course_map['DS'].id, student_class_id=te_comp_a_id, day_of_week=2, start_time="10:00", end_time="11:00", room_number="CR-301"),
        ])
    if 'SE-COMP-B' in class_map:
        se_comp_b_id = class_map['SE-COMP-B'].id
        db.add(models.TimetableEntry(course_id=course_map['ADBMS'].id, student_class_id=se_comp_b_id, day_of_week=1, start_time="11:00", end_time="12:00", room_number="CR-201"))
    db.commit()

    # --- 7. ATTENDANCE & GRADES ---
    if manaansh and mahip:
        iot_course_id = course_map['IoT'].id
        db_crud.mark_attendance(db, iot_course_id, [manaansh.id])
        db_crud.update_student_grade(db, manaansh.id, "IoT", 88)
        db_crud.update_student_grade(db, manaansh.id, "DS", 91)
        db_crud.update_student_grade(db, mahip.id, "ADBMS", 76)

    if pooja:
        db_crud.update_student_grade(db, pooja.id, "VLSI", 75)
    
    db.add_all([
        models.Event(title="HACKATHON: Code Battle", description="The COMP department is hosting...", event_type=EventType.HACKATHON, posted_by_id=aniket_sir.id, start_date=datetime.utcnow()),
        models.Event(title="Final Exam Dates", description="Check the academic calendar.", event_type=EventType.ANNOUNCEMENT, posted_by_id=aniket_sir.id, start_date=datetime.utcnow()),
    ])
    db.commit()

    print("\n✅ Database Populated with IDs!")
    print(f"Manaansh ID: {manaansh.student_id}")
    db.close()

if __name__ == "__main__":
    init()