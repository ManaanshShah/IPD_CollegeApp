// src/StudentMarks.jsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from './api';

function StudentMarks() {
  const navigate = useNavigate();
  const [marksData, setMarksData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const userStr = localStorage.getItem('user');
    if (!userStr) { navigate('/login'); return; }
    const user = JSON.parse(userStr);

    api.get(`/academic/marks/${user.id}`)
      .then(res => { setMarksData(res.data); setLoading(false); })
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

      <div style={{ padding: '20px', marginTop: '-40px' }}>
        
        {/* Main Report Card */}
        <div className="card" style={{ padding: '0', overflow: 'hidden' }}>
           <div style={{ padding: '20px', background: '#F9FAFB', borderBottom: '1px solid #E5E7EB', textAlign: 'center' }}>
              <div style={{ fontSize: '12px', color: '#6B7280', textTransform: 'uppercase', letterSpacing: '1px' }}>Semester V Results</div>
              <div style={{ fontSize: '24px', fontWeight: '700', color: '#1F2937', marginTop: '5px' }}>
                {loading ? '...' : calculatePercentage(marksData)}%
              </div>
              <div style={{ fontSize: '13px', color: '#2563EB', fontWeight: '500' }}>Overall Aggregate</div>
           </div>

           {loading ? (
             <p style={{ padding: '20px', textAlign: 'center', color: '#6B7280' }}>Fetching records...</p>
           ) : !marksData ? (
             <div style={{ padding: '40px 20px', textAlign: 'center' }}>
                <div style={{ fontSize: '30px', marginBottom: '10px' }}>📄</div>
                <p style={{ color: '#6B7280' }}>No marks uploaded yet.</p>
             </div>
           ) : (
             <div>
                {Object.entries(marksData.grades).map(([subject, score], index) => (
                  <div key={index} style={styles.row}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                       <div style={styles.subjectIcon}>{subject[0]}</div>
                       <span style={{ fontWeight: '500', color: '#374151' }}>{subject}</span>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                       <span style={{ fontWeight: '700', color: score >= 40 ? '#059669' : '#DC2626' }}>{score}</span>
                       <span style={{ fontSize: '12px', color: '#9CA3AF' }}>/100</span>
                    </div>
                  </div>
                ))}
             </div>
           )}
        </div>
      </div>
    </div>
  );
}

// Helper to calculate %
const calculatePercentage = (data) => {
  if (!data || !data.grades) return 0;
  const scores = Object.values(data.grades);
  if (scores.length === 0) return 0;
  const avg = scores.reduce((a, b) => a + b, 0) / scores.length;
  return avg.toFixed(1);
};

const styles = {
  header: {
    background: 'var(--primary)', padding: '20px 20px 60px 20px', 
    display: 'flex', justifyContent: 'space-between', alignItems: 'center'
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