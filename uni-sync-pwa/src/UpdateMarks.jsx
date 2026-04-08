// // src/UpdateMarks.jsx
// import { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import api from './api';

// function UpdateMarks() {
//   const navigate = useNavigate();
  
//   const [branches, setBranches] = useState([]);
//   const [classes, setClasses] = useState([]);
//   const [courses, setCourses] = useState([]); 
//   const [selectedBranch, setSelectedBranch] = useState('');
//   const [selectedClass, setSelectedClass] = useState('');
//   const [selectedCourseId, setSelectedCourseId] = useState(''); 
//   const [examType, setExamType] = useState('');

//   const [students, setStudents] = useState([]);
//   const [marksInput, setMarksInput] = useState({}); 
//   const [loading, setLoading] = useState(false);

//   useEffect(() => {
//     api.get('/academic/branches').then(res => setBranches(res.data));
//     api.get('/academic/courses').then(res => setCourses(res.data));
//   }, []);

//   useEffect(() => {
//     if (!selectedBranch) return;
//     api.get(`/academic/classes/${selectedBranch}`).then(res => setClasses(res.data));
//   }, [selectedBranch]);

//   const handleFetchStudents = async () => {
//     if (!selectedBranch || !selectedClass) return;
//     setLoading(true);
//     try {
//       const res = await api.get(`/academic/students/class/${selectedClass}`);
//       setStudents(res.data);
//     } catch (err) {
//       alert('Failed to load students.');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleUpdate = async (studentId) => {
//     if (!examType) { alert("Please select an Exam Type (e.g., Midterm 1)."); return; }
//     if (!selectedCourseId) { alert("Please select a Subject."); return; }
    
//     const mark = marksInput[studentId];
//     if (!mark) { alert("Please enter marks"); return; }

//     try {
//       await api.put(`/academic/marks/${studentId}`, {
//         course_id: parseInt(selectedCourseId),
//         exam_type: examType,
//         marks: parseInt(mark)
//       });
//       alert("✅ Saved!");
//     } catch (err) {
//       alert("❌ Failed to save.");
//     }
//   };

//   return (
//     <div>
//       <div style={styles.header}>
//         <button onClick={() => navigate('/faculty')} style={styles.backBtn}>←</button>
//         <h2 style={{ margin: 0, fontSize: '18px', color: 'white' }}>Update Results</h2>
//         <div style={{ width: '32px' }}></div>
//       </div>

//       <div style={{ padding: '20px', marginTop: '-30px' }}>
//         <div className="card">
//           <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
//             <div>
//               <label style={styles.label}>Branch</label>
//               <select className="input-field" style={{ margin: 0 }} value={selectedBranch} onChange={(e) => setSelectedBranch(e.target.value)}>
//                 <option value="">Select Dept</option>
//                 {branches.map(b => <option key={b.id} value={b.id}>{b.code}</option>)}
//               </select>
//             </div>
//             <div>
//               <label style={styles.label}>Class</label>
//               <select className="input-field" style={{ margin: 0 }} value={selectedClass} onChange={(e) => setSelectedClass(e.target.value)} disabled={!selectedBranch}>
//                 <option value="">Select Class</option>
//                 {classes.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
//               </select>
//             </div>
//           </div>

//           <button 
//             className="btn-primary"
//             onClick={handleFetchStudents} 
//             style={{ marginTop: '15px', padding: '10px' }}
//             disabled={!selectedBranch || !selectedClass}
//           >
//             Load Student List
//           </button>
//         </div>

//         {students.length > 0 && (
//           <div style={{ marginTop: '20px' }}>
//             <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '15px' }}>
//                 <div>
//                   <label style={styles.label}>Exam Type</label>
//                   <select 
//                     className="input-field"
//                     value={examType} 
//                     onChange={(e) => setExamType(e.target.value)}
//                   >
//                     <option value="">-- Choose Exam --</option>
//                     <option value="midterm_1">Midterm 1</option>
//                     <option value="midterm_2">Midterm 2</option>
//                     <option value="end_sem">End Semester</option>
//                   </select>
//                 </div>

//                 <div>
//                   <label style={styles.label}>Select Subject</label>
//                   <select 
//                     className="input-field"
//                     value={selectedCourseId} 
//                     onChange={(e) => setSelectedCourseId(e.target.value)}
//                   >
//                     <option value="">-- Choose Subject --</option>
//                     {courses.map(c => (
//                       <option key={c.id} value={c.id}>
//                         {c.name} ({c.course_code})
//                       </option>
//                     ))}
//                   </select>
//                 </div>
//             </div>

//             {students.map(student => (
//               <div key={student.id} className="card" style={styles.row}>
//                 <div style={{ flex: 1 }}>
//                   <div style={{ fontWeight: '600', color: '#1F2937' }}>{student.full_name}</div>
//                   <div style={{ fontSize: '12px', color: '#6B7280' }}>{student.student_id_code}</div>
//                 </div>
                
//                 <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
//                   <input 
//                     type="number" 
//                     placeholder="00"
//                     className="input-field"
//                     style={{ width: '60px', margin: 0, textAlign: 'center', padding: '10px' }}
//                     value={marksInput[student.id] || ''}
//                     onChange={(e) => setMarksInput({...marksInput, [student.id]: e.target.value})}
//                   />
//                   <button 
//                     onClick={() => handleUpdate(student.id)}
//                     style={styles.saveBtn}
//                   >
//                     Save
//                   </button>
//                 </div>
//               </div>
//             ))}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }

// const styles = {
//   header: {
//     background: 'var(--primary)', padding: '20px 20px 50px 20px', 
//     display: 'flex', justifyContent: 'space-between', alignItems: 'center',
//     borderBottomLeftRadius: '24px', borderBottomRightRadius: '24px'
//   },
//   backBtn: {
//     background: 'rgba(255,255,255,0.2)', border: 'none', color: 'white',
//     width: '32px', height: '32px', borderRadius: '50%', cursor: 'pointer'
//   },
//   label: { fontSize: '12px', fontWeight: '600', color: '#6B7280', marginBottom: '4px', display: 'block' },
//   row: {
//     display: 'flex', alignItems: 'center', padding: '15px', marginBottom: '10px',
//     borderLeft: '4px solid var(--primary)' 
//   },
//   saveBtn: {
//     background: '#10B981', color: 'white', border: 'none', borderRadius: '8px',
//     padding: '10px 15px', fontWeight: '600', cursor: 'pointer', fontSize: '13px'
//   }
// };

// export default UpdateMarks;

// src/UpdateMarks.jsx
// src/UpdateMarks.jsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Save, FileSpreadsheet } from 'lucide-react';
import api from './api';

function UpdateMarks() {
  const navigate = useNavigate();
  
  const [branches, setBranches] = useState([]);
  const [classes, setClasses] = useState([]);
  const [courses, setCourses] = useState([]); 
  const [selectedBranch, setSelectedBranch] = useState('');
  const [selectedClass, setSelectedClass] = useState('');
  const [selectedCourseId, setSelectedCourseId] = useState(''); 
  const [examType, setExamType] = useState('');

  const [students, setStudents] = useState([]);
  const [marksInput, setMarksInput] = useState({}); 
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    api.get('/academic/branches').then(res => setBranches(res.data));
    api.get('/academic/courses').then(res => setCourses(res.data));
  }, []);

  useEffect(() => {
    if (!selectedBranch) return;
    api.get(`/academic/classes/${selectedBranch}`).then(res => setClasses(res.data));
  }, [selectedBranch]);

  const handleFetchStudents = async () => {
    if (!selectedBranch || !selectedClass) return;
    setLoading(true);
    try {
      const res = await api.get(`/academic/students/class/${selectedClass}`);
      setStudents(res.data);
    } catch (err) {
      alert('Failed to load students.');
    } finally {
      setLoading(false);
    }
  };

  // INDIVIDUAL Save Function
  const handleUpdate = async (studentId) => {
    if (!examType) { alert("Please select an Exam Type."); return; }
    if (!selectedCourseId) { alert("Please select a Subject."); return; }
    
    const mark = marksInput[studentId];
    if (!mark) { alert("Please enter marks first."); return; }

    try {
      await api.put(`/academic/marks/${studentId}`, {
        course_id: parseInt(selectedCourseId),
        exam_type: examType,
        marks: parseInt(mark)
      });
      alert("✅ Student's mark saved!");
    } catch (err) {
      alert("❌ Failed to save.");
    }
  };

  // BULK Save Function
  const handleBulkSave = async () => {
    if (!examType) { alert("Please select an Exam Type."); return; }
    if (!selectedCourseId) { alert("Please select a Subject."); return; }
    
    // Filter out students who haven't had a mark typed in yet
    const studentsWithMarks = students.filter(s => marksInput[s.id] !== undefined && marksInput[s.id] !== '');

    if (studentsWithMarks.length === 0) {
      alert("Please enter marks for at least one student before saving.");
      return;
    }

    setSaving(true);
    try {
      // Promise.all fires all the updates to the backend at the exact same time
      await Promise.all(studentsWithMarks.map(student => 
        api.put(`/academic/marks/${student.id}`, {
          course_id: parseInt(selectedCourseId),
          exam_type: examType,
          marks: parseInt(marksInput[student.id])
        })
      ));
      
      alert("✅ All entered marks saved successfully!");
      navigate('/faculty');
    } catch (err) {
      console.error(err);
      alert("❌ Failed to save some marks. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  // Calculate how many students currently have marks typed in
  const enteredCount = Object.values(marksInput).filter(val => val !== '').length;

  return (
    <div style={{ paddingBottom: '90px' }}>
      <div style={styles.header}>
        <button onClick={() => navigate('/faculty')} style={styles.backBtn}>←</button>
        <h2 style={{ margin: 0, fontSize: '18px', color: 'white', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <FileSpreadsheet size={22} /> Update Results
        </h2>
        <div style={{ width: '32px' }}></div>
      </div>

      <div style={{ padding: '20px', marginTop: '-30px' }}>
        <div className="card">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
            <div>
              <label style={styles.label}>Branch</label>
              <select className="input-field" style={{ margin: 0 }} value={selectedBranch} onChange={(e) => setSelectedBranch(e.target.value)}>
                <option value="">Select Dept</option>
                {branches.map(b => <option key={b.id} value={b.id}>{b.code}</option>)}
              </select>
            </div>
            <div>
              <label style={styles.label}>Class</label>
              <select className="input-field" style={{ margin: 0 }} value={selectedClass} onChange={(e) => setSelectedClass(e.target.value)} disabled={!selectedBranch}>
                <option value="">Select Class</option>
                {classes.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
          </div>

          <button 
            className="btn-primary"
            onClick={handleFetchStudents} 
            style={{ marginTop: '15px', padding: '10px', userSelect: 'none', WebkitUserSelect: 'none' }}
            disabled={!selectedBranch || !selectedClass || loading}
          >
            {loading ? 'Loading...' : 'Load Student List'}
          </button>
        </div>

        {students.length > 0 && (
          <div style={{ marginTop: '20px', paddingBottom: '80px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '15px' }}>
                <div>
                  <label style={styles.label}>Exam Type</label>
                  <select 
                    className="input-field"
                    value={examType} 
                    onChange={(e) => setExamType(e.target.value)}
                  >
                    <option value="">-- Choose Exam --</option>
                    <option value="midterm_1">Midterm 1</option>
                    <option value="midterm_2">Midterm 2</option>
                    <option value="end_sem">End Semester</option>
                  </select>
                </div>

                <div>
                  <label style={styles.label}>Select Subject</label>
                  <select 
                    className="input-field"
                    value={selectedCourseId} 
                    onChange={(e) => setSelectedCourseId(e.target.value)}
                  >
                    <option value="">-- Choose Subject --</option>
                    {courses.map(c => (
                      <option key={c.id} value={c.id}>
                        {c.name} ({c.course_code})
                      </option>
                    ))}
                  </select>
                </div>
            </div>

            {/* Student List WITH individual save buttons */}
            {students.map(student => (
              <div key={student.id} className="card" style={styles.row}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: '600', color: '#1F2937' }}>{student.full_name}</div>
                  <div style={{ fontSize: '12px', color: '#6B7280' }}>{student.student_id_code}</div>
                </div>
                
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <input 
                    type="number" 
                    placeholder="00"
                    className="input-field"
                    style={{ width: '60px', margin: 0, textAlign: 'center', padding: '10px', fontWeight: 'bold' }}
                    value={marksInput[student.id] || ''}
                    onChange={(e) => setMarksInput({...marksInput, [student.id]: e.target.value})}
                  />
                  <button 
                    onClick={() => handleUpdate(student.id)}
                    style={styles.saveBtn}
                  >
                    <Save size={16} /> Save
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Floating Bottom Bar for Bulk Save */}
      {students.length > 0 && (
        <div style={styles.bottomBar}>
          <div style={{ fontSize: '14px', fontWeight: '600', color: '#4B5563' }}>
            Filled: <span style={{ color: '#2563EB' }}>{enteredCount}</span> / {students.length}
          </div>
          <button 
            className="btn-primary" 
            onClick={handleBulkSave} 
            disabled={saving || enteredCount === 0}
            style={{ width: 'auto', padding: '10px 20px', display: 'flex', alignItems: 'center', gap: '8px', userSelect: 'none', WebkitUserSelect: 'none' }}
          >
            <Save size={18} /> {saving ? 'Saving...' : 'Save All Marks'}
          </button>
        </div>
      )}
    </div>
  );
}

const styles = {
  header: {
    background: 'var(--primary)', padding: '20px 20px 50px 20px', 
    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
    borderBottomLeftRadius: '24px', borderBottomRightRadius: '24px'
  },
  backBtn: {
    background: 'rgba(255,255,255,0.2)', border: 'none', color: 'white',
    width: '32px', height: '32px', borderRadius: '50%', cursor: 'pointer',
    userSelect: 'none', WebkitUserSelect: 'none'
  },
  label: { fontSize: '12px', fontWeight: '600', color: '#6B7280', marginBottom: '4px', display: 'block' },
  row: {
    display: 'flex', alignItems: 'center', padding: '15px', marginBottom: '10px',
    borderLeft: '4px solid var(--primary)' 
  },
  saveBtn: {
    display: 'flex', alignItems: 'center', gap: '4px',
    background: '#10B981', color: 'white', border: 'none', borderRadius: '8px',
    padding: '8px 12px', fontWeight: '600', cursor: 'pointer', fontSize: '13px',
    userSelect: 'none', WebkitUserSelect: 'none'
  },
  bottomBar: {
    position: 'fixed', bottom: 0, left: 0, right: 0, background: 'white', borderTop: '1px solid #E5E7EB',
    padding: '15px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', zIndex: 100,
    boxShadow: '0 -4px 10px rgba(0,0,0,0.05)'
  }
};

export default UpdateMarks;