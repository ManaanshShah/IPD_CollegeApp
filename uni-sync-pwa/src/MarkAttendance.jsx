// // src/MarkAttendance.jsx
// import { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import api from './api';

// function MarkAttendance() {
//   const navigate = useNavigate();
  
//   // Selection States
//   const [branches, setBranches] = useState([]);
//   const [selectedBranch, setSelectedBranch] = useState('');
//   const [classes, setClasses] = useState([]);
//   const [selectedClass, setSelectedClass] = useState('');
//   const [courses, setCourses] = useState([]);
//   const [selectedCourse, setSelectedCourse] = useState('');
  
//   const [students, setStudents] = useState([]);
//   const [attendance, setAttendance] = useState({});
//   const [loading, setLoading] = useState(false);

//   // Initial Fetches
//   useEffect(() => {
//     api.get('/academic/branches').then(res => setBranches(res.data));
//     api.get('/academic/courses').then(res => setCourses(res.data));
//   }, []);

//   // Fetch Classes
//   useEffect(() => {
//     if (selectedBranch) {
//       setClasses([]); setSelectedClass('');
//       api.get(`/academic/classes/${selectedBranch}`).then(res => setClasses(res.data));
//     }
//   }, [selectedBranch]);

//   // Fetch Students
//   useEffect(() => {
//     if (selectedClass) {
//       setLoading(true);
//       api.get(`/academic/students/class/${selectedClass}`)
//         .then(res => {
//           setStudents(res.data);
//           const initial = {};
//           res.data.forEach(s => initial[s.id] = true); // Default Present
//           setAttendance(initial);
//         })
//         .finally(() => setLoading(false));
//     } else {
//       setStudents([]);
//     }
//   }, [selectedClass]);

//   const toggleAttendance = (id) => {
//     setAttendance(prev => ({ ...prev, [id]: !prev[id] }));
//   };

//   const handleSubmit = async () => {
//     if (!selectedCourse) { alert("Please select a Subject!"); return; }
//     if (students.length === 0) return;

//     try {
//       const payload = {
//         class_id: parseInt(selectedClass),
//         course_id: parseInt(selectedCourse),
//         attendance_data: attendance
//       };
//       await api.post('/academic/attendance/save', payload);
//       alert("✅ Attendance Saved!");
//       navigate('/faculty');
//     } catch (err) {
//       console.error(err);
//       alert("Failed to save.");
//     }
//   };

//   // Calculate stats for the bottom bar
//   const presentCount = Object.values(attendance).filter(Boolean).length;
//   const totalCount = students.length;

//   return (
//     <div style={{ paddingBottom: '90px' }}>
//       {/* Header */}
//       <div style={styles.header}>
//         <button onClick={() => navigate('/faculty')} style={styles.backBtn}>←</button>
//         <h2 style={{ margin: 0, fontSize: '18px' }}>Mark Attendance</h2>
//         <div style={{ width: '32px' }}></div>
//       </div>

//       <div style={{ padding: '20px' }}>
        
//         {/* Controls Card */}
//         <div className="card" style={{ padding: '15px' }}>
//           <div style={styles.controlRow}>
//             <label style={styles.label}>Branch</label>
//             <select className="input-field" style={{ margin: 0 }} value={selectedBranch} onChange={(e) => setSelectedBranch(e.target.value)}>
//               <option value="">Select Dept</option>
//               {branches.map(b => <option key={b.id} value={b.id}>{b.code}</option>)}
//             </select>
//           </div>

//           <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginTop: '10px' }}>
//             <div>
//               <label style={styles.label}>Class</label>
//               <select className="input-field" style={{ margin: 0 }} value={selectedClass} onChange={(e) => setSelectedClass(e.target.value)}>
//                 <option value="">Select Class</option>
//                 {classes.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
//               </select>
//             </div>
//             <div>
//                <label style={styles.label}>Subject</label>
//                <select className="input-field" style={{ margin: 0 }} value={selectedCourse} onChange={(e) => setSelectedCourse(e.target.value)}>
//                  <option value="">Select Subject</option>
//                  {courses.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
//                </select>
//             </div>
//           </div>
//         </div>

//         {/* Student List */}
//         {loading && <p style={{ textAlign: 'center', color: '#6B7280', marginTop: '20px' }}>Loading students...</p>}
        
//         <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '10px' }}>
//           {students.map(student => (
//             <div key={student.id} className="card" style={styles.studentRow}>
//               <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
//                  <div style={styles.avatar}>{student.first_name[0]}</div>
//                  <div>
//                     <div style={{ fontWeight: '600', color: '#1F2937' }}>{student.full_name}</div>
//                     <div style={{ fontSize: '12px', color: '#6B7280' }}>{student.student_id_code}</div>
//                  </div>
//               </div>

//               <button 
//                 onClick={() => toggleAttendance(student.id)}
//                 style={{
//                   ...styles.statusBtn,
//                   background: attendance[student.id] ? '#DCFCE7' : '#FEE2E2', // Light Green / Red
//                   color: attendance[student.id] ? '#166534' : '#991B1B',       // Dark Green / Red
//                 }}
//               >
//                 {attendance[student.id] ? 'Present' : 'Absent'}
//               </button>
//             </div>
//           ))}
//         </div>
//       </div>

//       {/* Floating Bottom Bar */}
//       {students.length > 0 && (
//         <div style={styles.bottomBar}>
//           <div style={{ fontSize: '14px', fontWeight: '600' }}>
//             Summary: <span style={{ color: '#2563EB' }}>{presentCount} Present</span> / {totalCount}
//           </div>
//           <button className="btn-primary" onClick={handleSubmit} style={{ width: 'auto', padding: '10px 20px' }}>
//             Save Records
//           </button>
//         </div>
//       )}
//     </div>
//   );
// }

// const styles = {
//   header: {
//     background: 'white', padding: '15px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
//     borderBottom: '1px solid #E5E7EB', position: 'sticky', top: 0, zIndex: 50
//   },
//   backBtn: {
//     background: 'none', border: '1px solid #E5E7EB', borderRadius: '50%', width: '32px', height: '32px', cursor: 'pointer'
//   },
//   label: { fontSize: '12px', fontWeight: '600', color: '#6B7280', marginBottom: '4px', display: 'block' },
//   studentRow: {
//     display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 15px', marginBottom: 0
//   },
//   avatar: {
//     width: '36px', height: '36px', borderRadius: '50%', background: '#F3F4F6', color: '#6B7280',
//     display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '14px'
//   },
//   statusBtn: {
//     padding: '6px 16px', borderRadius: '20px', border: 'none', fontWeight: '600', fontSize: '13px', cursor: 'pointer', minWidth: '80px'
//   },
//   bottomBar: {
//     position: 'fixed', bottom: 0, left: 0, right: 0, background: 'white', borderTop: '1px solid #E5E7EB',
//     padding: '15px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', zIndex: 100
//   }
// };

// export default MarkAttendance;

// src/MarkAttendance.jsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from './api';

function MarkAttendance() {
  const navigate = useNavigate();
  
  const [branches, setBranches] = useState([]);
  const [selectedBranch, setSelectedBranch] = useState('');
  const [classes, setClasses] = useState([]);
  const [selectedClass, setSelectedClass] = useState('');
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState('');
  
  const [students, setStudents] = useState([]);
  const [attendance, setAttendance] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    api.get('/academic/branches').then(res => setBranches(res.data));
    api.get('/academic/courses').then(res => setCourses(res.data));
  }, []);

  useEffect(() => {
    if (selectedBranch) {
      setClasses([]); setSelectedClass('');
      api.get(`/academic/classes/${selectedBranch}`).then(res => setClasses(res.data));
    }
  }, [selectedBranch]);

  useEffect(() => {
    if (selectedClass) {
      setLoading(true);
      api.get(`/academic/students/class/${selectedClass}`)
        .then(res => {
          setStudents(res.data);
          const initial = {};
          res.data.forEach(s => initial[s.id] = true); 
          setAttendance(initial);
        })
        .finally(() => setLoading(false));
    } else {
      setStudents([]);
    }
  }, [selectedClass]);

  const toggleAttendance = (id) => {
    setAttendance(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const handleSubmit = async () => {
    if (!selectedCourse) { alert("Please select a Subject!"); return; }
    if (students.length === 0) return;

    try {
      const payload = {
        class_id: parseInt(selectedClass),
        course_id: parseInt(selectedCourse),
        attendance_data: attendance
      };
      await api.post('/academic/attendance/save', payload);
      alert("✅ Attendance Saved!");
      navigate('/faculty');
    } catch (err) {
      console.error(err);
      alert("Failed to save.");
    }
  };

  const presentCount = Object.values(attendance).filter(Boolean).length;
  const totalCount = students.length;

  return (
    <div style={{ paddingBottom: '90px' }}>
      <div style={styles.header}>
        <button onClick={() => navigate('/faculty')} style={styles.backBtn}>←</button>
        <h2 style={{ margin: 0, fontSize: '18px' }}>Mark Attendance</h2>
        <div style={{ width: '32px' }}></div>
      </div>

      <div style={{ padding: '20px' }}>
        
        <div className="card" style={{ padding: '15px' }}>
          <div style={styles.controlRow}>
            <label style={styles.label}>Branch</label>
            <select className="input-field" style={{ margin: 0 }} value={selectedBranch} onChange={(e) => setSelectedBranch(e.target.value)}>
              <option value="">Select Dept</option>
              {branches.map(b => <option key={b.id} value={b.id}>{b.code}</option>)}
            </select>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginTop: '10px' }}>
            <div>
              <label style={styles.label}>Class</label>
              <select className="input-field" style={{ margin: 0 }} value={selectedClass} onChange={(e) => setSelectedClass(e.target.value)}>
                <option value="">Select Class</option>
                {classes.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
            <div>
               <label style={styles.label}>Subject</label>
               <select className="input-field" style={{ margin: 0 }} value={selectedCourse} onChange={(e) => setSelectedCourse(e.target.value)}>
                 <option value="">Select Subject</option>
                 {courses.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
               </select>
            </div>
          </div>
        </div>

        {loading && <p style={{ textAlign: 'center', color: '#6B7280', marginTop: '20px' }}>Loading students...</p>}
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '10px' }}>
          {students.map(student => (
            <div key={student.id} className="card" style={styles.studentRow}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                 <div style={styles.avatar}>{student.first_name[0]}</div>
                 <div>
                    <div style={{ fontWeight: '600', color: '#1F2937' }}>{student.full_name}</div>
                    <div style={{ fontSize: '12px', color: '#6B7280' }}>{student.student_id_code}</div>
                 </div>
              </div>

              <button 
                onClick={() => toggleAttendance(student.id)}
                style={{
                  ...styles.statusBtn,
                  background: attendance[student.id] ? '#DCFCE7' : '#FEE2E2', 
                  color: attendance[student.id] ? '#166534' : '#991B1B',       
                }}
              >
                {attendance[student.id] ? 'Present' : 'Absent'}
              </button>
            </div>
          ))}
        </div>
      </div>

      {students.length > 0 && (
        <div style={styles.bottomBar}>
          <div style={{ fontSize: '14px', fontWeight: '600' }}>
            Summary: <span style={{ color: '#2563EB' }}>{presentCount} Present</span> / {totalCount}
          </div>
          <button className="btn-primary" onClick={handleSubmit} style={{ width: 'auto', padding: '10px 20px', userSelect: 'none', WebkitUserSelect: 'none' }}>
            Save Records
          </button>
        </div>
      )}
    </div>
  );
}

const styles = {
  header: {
    background: 'white', padding: '15px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
    borderBottom: '1px solid #E5E7EB', position: 'sticky', top: 0, zIndex: 50
  },
  backBtn: {
    background: 'none', border: '1px solid #E5E7EB', borderRadius: '50%', width: '32px', height: '32px', cursor: 'pointer',
    userSelect: 'none', WebkitUserSelect: 'none'
  },
  label: { fontSize: '12px', fontWeight: '600', color: '#6B7280', marginBottom: '4px', display: 'block' },
  studentRow: {
    display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 15px', marginBottom: 0
  },
  avatar: {
    width: '36px', height: '36px', borderRadius: '50%', background: '#F3F4F6', color: '#6B7280',
    display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '14px',
    userSelect: 'none', WebkitUserSelect: 'none'
  },
  statusBtn: {
    padding: '6px 16px', borderRadius: '20px', border: 'none', fontWeight: '600', fontSize: '13px', cursor: 'pointer', minWidth: '80px',
    userSelect: 'none', WebkitUserSelect: 'none'
  },
  bottomBar: {
    position: 'fixed', bottom: 0, left: 0, right: 0, background: 'white', borderTop: '1px solid #E5E7EB',
    padding: '15px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', zIndex: 100
  }
};

export default MarkAttendance;