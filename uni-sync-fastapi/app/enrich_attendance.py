# enrich_attendance.py
import random
from datetime import datetime, timedelta
from app.db.database import SessionLocal
from app.db import models, crud
from app.db.models import AttendanceStatus, UserRole

def populate_class_attendance():
    db = SessionLocal()
    print("📊 Generating Realistic Class Attendance for TE-COMP-A...")

    # 1. Find the Class ID for TE-COMP-A
    # We assume 'TE-COMP-A' exists from populate_db
    target_class = db.query(models.StudentClass).filter(models.StudentClass.name == "TE-COMP-A").first()
    if not target_class:
        print("❌ Class 'TE-COMP-A' not found.")
        return

    # 2. Get ALL Students in this Class (Manaansh, Neil, etc.)
    students = db.query(models.User).filter(
        models.User.student_class_id == target_class.id,
        models.User.role == UserRole.STUDENT
    ).all()
    
    if not students:
        print("❌ No students found in TE-COMP-A.")
        return
        
    student_ids = [s.id for s in students]
    print(f"   -> Found {len(students)} students: {[s.first_name for s in students]}")

    # 3. Target Courses (COMPS subjects)
    courses_to_update = ["IoT", "DS", "ADBMS"]
    
    for course_name in courses_to_update:
        course = db.query(models.Course).filter(models.Course.name == course_name).first()
        if not course: continue
            
        print(f"   -> Simulating 10 lectures for {course_name}...")
        
        for i in range(1, 11): # 10 Sessions per subject
            # Date: Past 10 days
            fake_date = datetime.utcnow() - timedelta(days=i*2)
            
            # 4. RANDOMIZE ATTENDANCE
            # Pick random students to be PRESENT (e.g., 70-90% of class)
            # k is the number of present students
            k = random.randint(int(len(students)*0.7), len(students)) 
            present_students = random.sample(student_ids, k)
            
            # 5. USE THE CRUD FUNCTION
            # This uses your new logic: Marks 'present_students' as PRESENT
            # and AUTOMATICALLY marks everyone else as ABSENT.
            
            # We manually call the logic here to inject the fake date
            # (The standard crud.mark_attendance uses datetime.utcnow())
            
            # A. Create Session
            session = models.AttendanceSession(course_id=course.id, session_date=fake_date)
            db.add(session)
            db.commit()
            db.refresh(session)
            
            # B. Mark Present/Absent
            records = []
            for s_id in student_ids:
                status = AttendanceStatus.PRESENT if s_id in present_students else AttendanceStatus.ABSENT
                records.append(models.AttendanceRecord(session_id=session.id, student_id=s_id, status=status))
            
            db.add_all(records)
            db.commit()

    print("✅ Attendance Data Generated for ALL Students in TE-COMP-A!")
    db.close()

if __name__ == "__main__":
    populate_class_attendance()