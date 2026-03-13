// src/StudentMarks.jsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from './api';

function StudentMarks() {
  const navigate = useNavigate();
  // Initialize with empty arrays to prevent crashes
  const [marksData, setMarksData] = useState({ midterm_1: [], midterm_2: [], end_sem: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const userStr = localStorage.getItem('user');
    if (!userStr) { navigate('/login'); return; }
    const user = JSON.parse(userStr);

    api.get(`/academic/marks/${user.id}`)
      .then(res => { 
        setMarksData(res.data); 
        setLoading(false); 
      })
      .catch(() => { setLoading(false); });
  }, [navigate]);

  return (
    <div>
      {/* Header */}
      <div style={styles.header}>
        <button onClick={() => navigate('/dashboard')} style={styles.backBtn}>←</button>
        <h2 style={{ margin: 0, fontSize: '18px', color: 'white' }}>Academic Report</h2>
        <div style={{ width: '32px' }}></div>
      </div>

      <div style={{ padding: '20px', marginTop: '-30px' }}>
        
        {/* Main Report Card */}
        <div className="card" style={{ padding: '0', overflow: 'hidden' }}>
           {loading ? (
             <p style={{ padding: '30px', textAlign: 'center', color: '#6B7280' }}>Fetching your academic records...</p>
           ) : (
             <div style={{ padding: '20px' }}>
                {renderExamSection("Midsemester Exam 1", marksData.midterm_1)}
                {renderExamSection("Midsemester Exam 2", marksData.midterm_2)}
                {renderExamSection("End Semester Exam", marksData.end_sem)}
             </div>
           )}
        </div>
      </div>
    </div>
  );
}

// Helper to render sections - Now always shows the section!
const renderExamSection = (title, gradesArray) => {
    return (
        <div style={{ marginBottom: '25px' }}>
            <h3 style={{ fontSize: '15px', color: '#4B5563', margin: '0 0 10px 5px', borderBottom: '2px solid #E5E7EB', paddingBottom: '5px' }}>
                {title}
            </h3>
            
            {(!gradesArray || gradesArray.length === 0) ? (
                /* Empty State Box */
                <div style={{ padding: '15px', textAlign: 'center', color: '#9CA3AF', fontSize: '13px', background: '#F9FAFB', borderRadius: '12px', border: '1px dashed #E5E7EB' }}>
                    Marks not yet uploaded
                </div>
            ) : (
                /* Filled Grades Box */
                <div style={{ background: 'white', borderRadius: '12px', border: '1px solid #F3F4F6', overflow: 'hidden' }}>
                    {gradesArray.map((grade, index) => (
                        <div key={index} style={styles.row}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <div style={styles.subjectIcon}>{grade.course_name.charAt(0)}</div>
                                <div>
                                    <div style={{ fontWeight: '500', color: '#374151', fontSize: '14px' }}>{grade.course_name}</div>
                                    <div style={{ fontSize: '12px', color: '#9CA3AF' }}>{grade.course_code}</div>
                                </div>
                            </div>
                            <div style={{ textAlign: 'right' }}>
                                <span style={{ fontWeight: '700', fontSize: '16px', color: (grade.marks_obtained / grade.max_marks >= 0.4) ? '#059669' : '#DC2626' }}>
                                    {grade.marks_obtained}
                                </span>
                                <span style={{ fontSize: '12px', color: '#9CA3AF' }}> /{grade.max_marks}</span>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

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
  row: {
    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
    padding: '16px 20px', borderBottom: '1px solid #F3F4F6'
  },
  subjectIcon: {
    width: '30px', height: '30px', borderRadius: '8px', background: '#EFF6FF',
    color: '#2563EB', display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontWeight: '600', fontSize: '14px'
  }
};

export default StudentMarks;