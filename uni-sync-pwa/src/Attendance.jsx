// src/Attendance.jsx
import { useEffect, useState } from 'react';
import api from './api';

function Attendance() {
  const [stats, setStats] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAttendance = async () => {
      try {
        const res = await api.get('/attendance/my-stats');
        setStats(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchAttendance();
  }, []);

  // Calculate Overall Percentage logic
  const totalClasses = stats.reduce((acc, curr) => acc + curr.total_sessions, 0);
  const totalAttended = stats.reduce((acc, curr) => acc + curr.present_sessions, 0);
  const overallPercent = totalClasses > 0 ? Math.round((totalAttended / totalClasses) * 100) : 0;
  
  // Determine Status Color
  const getStatusColor = (pct) => {
    if (pct < 75) return '#dc3545'; // Red
    if (pct < 80) return '#ffc107'; // Yellow
    return '#28a745'; // Green
  };

  const overallColor = getStatusColor(overallPercent);

  return (
    <div>
      {/* App Header */}
      <div className="app-header">
        <span></span> {/* Empty span for spacing if back button isn't needed here */}
        <h2 className="page-title">Attendance</h2>
        <span>🔔</span>
      </div>

      <div style={{ padding: '20px' }}>
        {loading ? (
          <p style={{ textAlign: 'center', marginTop: '20px' }}>Loading stats...</p>
        ) : (
          <>
            {/* 1. Overall Circular Chart */}
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '30px', marginTop: '10px' }}>
              <div style={{ 
                width: '180px', height: '180px', borderRadius: '50%', 
                background: `conic-gradient(${overallColor} ${overallPercent * 3.6}deg, #e9ecef 0deg)`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: '0 4px 10px rgba(0,0,0,0.1)'
              }}>
                <div style={{ 
                  width: '155px', height: '155px', background: 'white', borderRadius: '50%', 
                  display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' 
                }}>
                  <span style={{ fontSize: '42px', fontWeight: '800', color: '#212529' }}>
                    {overallPercent}%
                  </span>
                  <span style={{ fontSize: '14px', color: overallColor, fontWeight: '600', marginTop: '-5px' }}>
                    {overallPercent < 75 ? 'Low Attendance' : 'On Track'}
                  </span>
                </div>
              </div>
            </div>

            <h3 style={{ fontSize: '16px', marginBottom: '15px', color: '#6c757d', fontWeight: '600' }}>
              Subject Breakdown
            </h3>

            {/* 2. Subject Cards */}
            {stats.length === 0 && <p style={{ textAlign: 'center', color: '#999' }}>No attendance records found.</p>}

            {stats.map((subject, index) => {
              const pct = subject.attendance_percentage;
              const barColor = getStatusColor(pct);

              return (
                <div key={index} className="card">
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px', alignItems: 'center' }}>
                    <span style={{ fontWeight: '700', fontSize: '15px', color: '#333' }}>
                      {subject.course_name}
                    </span>
                    <span style={{ fontWeight: '700', color: barColor, fontSize: '14px' }}>
                      {Math.round(pct)}%
                    </span>
                  </div>
                  
                  {/* Progress Bar */}
                  <div style={{ height: '8px', background: '#f1f3f5', borderRadius: '4px', overflow: 'hidden', marginBottom: '10px' }}>
                    <div style={{ width: `${pct}%`, background: barColor, height: '100%', borderRadius: '4px' }} />
                  </div>
                  
                  {/* Details Footer */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: '#adb5bd' }}>
                    <span>{subject.present_sessions}/{subject.total_sessions} Sessions</span>
                    {pct < 75 && <span style={{ color: '#dc3545', fontWeight: '600' }}>⚠️ Low!</span>}
                  </div>
                </div>
              );
            })}
          </>
        )}
      </div>
    </div>
  );
}

export default Attendance;