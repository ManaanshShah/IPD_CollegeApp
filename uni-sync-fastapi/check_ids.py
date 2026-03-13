# check_ids.py
from app.db.database import SessionLocal
from app.db import models 

db = SessionLocal()

print("\n--- 🔍 DEBUGGING DATABASE IDs ---")

# 1. Check Classes
print("\n🏫 AVAILABLE CLASSES:")
classes = db.query(models.StudentClass).all()
for c in classes:
    print(f"   [ID: {c.id}] Name: {c.name} (BranchID: {c.branch_id})")

# 2. Check Students
print("\n👨‍🎓 STUDENTS & THEIR ASSIGNED CLASS:")
students = db.query(models.User).all()

found_any = False
for s in students:
    # Check if role matches 'student' string OR Enum
    if str(s.role) == "UserRole.STUDENT" or str(s.role) == "student":
        found_any = True
        print(f"   Name: {s.first_name} {s.last_name:<10} | Assigned Class ID: {s.student_class_id}")

if not found_any:
    print("   (No students found!)")

print("\n----------------------------------")