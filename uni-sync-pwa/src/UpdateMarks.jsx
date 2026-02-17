// src/UpdateMarks.jsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from './api';

function UpdateMarks() {
  const navigate = useNavigate();
  
  // Selection State
  const [branches, setBranches] = useState([]);
  const [classes, setClasses] = useState([]);
  const [selectedBranch, setSelectedBranch] = useState('');
  const [selectedClass, setSelectedClass] = useState('');
  const [subjectName, setSubjectName] = useState(''); // e.g., "IoT"
  
  // Student Data
  const [students, setStudents] = useState([]);
  const [marksInput, setMarksInput] = useState({}); // Stores marks: { studentId: 85 }
  const [loading, setLoading] = useState(false);

  // Initial Fetches
  useEffect(() => {
    api.get('/academic/branches').then(res => setBranches(res.data));
  }, []);

  useEffect(() => {
    if (!selectedBranch) return;
    api.get(`/academic/classes/${selectedBranch}`).then(res => setClasses(res.data));
  }, [selectedBranch]);

  // Load Students
  const handleFetchStudents = async () => {
    if (!selectedBranch || !selectedClass) return;
    setLoading(true);
    try {
      // Use the correct new endpoint
      const res = await api.get(`/academic/students/class/${selectedClass}`);
      setStudents(res.data);
    } catch (err) {
      alert('Failed to load students.');
    } finally {
      setLoading(false);
    }
  };

  // Save Mark
  const handleUpdate = async (studentId) => {
    if (!subjectName) { alert("Please enter a Subject Name first (e.g., IoT)"); return; }
    const mark = marksInput[studentId];
    if (!mark) { alert("Please enter marks"); return; }

    try {
      await api.put(`/academic/marks/${studentId}`, {
        course_name: subjectName,
        marks: parseInt(mark)
      });
      alert("✅ Saved!");
    } catch (err) {
      alert("❌ Failed to save.");
    }
  };

  return (
    <div>
      {/* Header */}
      <div style={styles.header}>
        <button onClick={() => navigate('/faculty')} style={styles.backBtn}>←</button>
        <h2 style={{ margin: 0, fontSize: '18px', color: 'white' }}>Update Results</h2>
        <div style={{ width: '32px' }}></div>
      </div>

      <div style={{ padding: '20px', marginTop: '-30px' }}>
        
        {/* Filter Card */}
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
            style={{ marginTop: '15px', padding: '10px' }}
            disabled={!selectedBranch || !selectedClass}
          >
            Load Student List
          </button>
        </div>

        {/* Student List */}
        {students.length > 0 && (
          <div style={{ marginTop: '20px' }}>
            
            {/* Subject Input */}
            <div style={{ marginBottom: '15px' }}>
              <label style={styles.label}>Subject Name (e.g. IoT)</label>
              <input 
                type="text" 
                className="input-field"
                placeholder="Enter Subject Code/Name"
                value={subjectName} 
                onChange={(e) => setSubjectName(e.target.value)}
              />
            </div>

            {/* List */}
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
                    style={{ width: '60px', margin: 0, textAlign: 'center', padding: '10px' }}
                    value={marksInput[student.id] || ''}
                    onChange={(e) => setMarksInput({...marksInput, [student.id]: e.target.value})}
                  />
                  <button 
                    onClick={() => handleUpdate(student.id)}
                    style={styles.saveBtn}
                  >
                    Save
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
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
    width: '32px', height: '32px', borderRadius: '50%', cursor: 'pointer'
  },
  label: { fontSize: '12px', fontWeight: '600', color: '#6B7280', marginBottom: '4px', display: 'block' },
  row: {
    display: 'flex', alignItems: 'center', padding: '15px', marginBottom: '10px',
    borderLeft: '4px solid var(--primary)' // Nice accent border
  },
  saveBtn: {
    background: '#10B981', color: 'white', border: 'none', borderRadius: '8px',
    padding: '10px 15px', fontWeight: '600', cursor: 'pointer', fontSize: '13px'
  }
};

export default UpdateMarks;