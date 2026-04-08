// // src/Timetable.jsx
// import { useEffect, useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import api from './api';

// function Timetable() {
//   const navigate = useNavigate();
//   const [schedule, setSchedule] = useState([]);
//   const [day, setDay] = useState(new Date().getDay()); // 0=Sun, 1=Mon...
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchTimetable = async () => {
//       try {
//         const res = await api.get('/academic/timetable');
//         setSchedule(res.data);
//       } catch (err) {
//         console.error(err);
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchTimetable();
//   }, []);

//   // Helper to map day numbers to keys used in your backend data
//   const dayKeys = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];
//   const dayLabels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
//   const currentDayKey = dayKeys[day];

//   // Logic to only show weekdays (Mon-Fri) if you want, or handle weekends
//   // For this UI, we will just show Mon-Fri to keep it clean, unless it's Sat/Sun
//   const displayDays = [1, 2, 3, 4, 5]; 

//   return (
//     <div>
//       {/* Header */}
//       <div style={styles.header}>
//         <button onClick={() => navigate('/dashboard')} style={styles.backBtn}>←</button>
//         <h2 style={{ margin: 0, fontSize: '18px', color: 'white' }}>Weekly Schedule</h2>
//         <div style={{ width: '32px' }}></div>
//       </div>

//       <div style={{ padding: '20px', marginTop: '-30px' }}>
        
//         {/* Day Selector (Floating Card) */}
//         <div className="card" style={styles.dayCard}>
//           <div style={styles.dayGrid}>
//             {displayDays.map((d) => (
//               <button 
//                 key={d} 
//                 onClick={() => setDay(d)} 
//                 style={{
//                   ...styles.dayBtn,
//                   background: day === d ? 'var(--primary)' : 'transparent',
//                   color: day === d ? 'white' : '#6B7280',
//                 }}
//               >
//                 <span style={{ fontSize: '12px', fontWeight: '500' }}>{dayLabels[d]}</span>
//                 {/* Optional: Add date number if you want to get fancy later */}
//               </button>
//             ))}
//           </div>
//           <div style={{ textAlign: 'center', marginTop: '10px', fontSize: '13px', color: '#6B7280', fontWeight: '500' }}>
//             {dayLabels[day]}'s Classes
//           </div>
//         </div>

//         {/* Timeline */}
//         {loading ? (
//           <p style={{ textAlign: 'center', marginTop: '40px', color: '#9CA3AF' }}>Loading schedule...</p>
//         ) : (
//           <div style={{ marginTop: '20px' }}>
            
//             {/* Empty State */}
//             {schedule.every(s => !s[currentDayKey] || s[currentDayKey] === '-') && (
//               <div style={{ textAlign: 'center', padding: '40px 20px', color: '#9CA3AF' }}>
//                 <div style={{ fontSize: '40px', marginBottom: '10px', opacity: 0.5 }}>💤</div>
//                 <p>No classes scheduled.</p>
//               </div>
//             )}

//             {schedule.map((slot, index) => {
//               const subject = slot[currentDayKey];
//               if (!subject || subject === '-') return null;

//               // Color coding based on time (morning/afternoon)
//               const isMorning = slot.time.includes('AM') || parseInt(slot.time) < 12;
//               const accentColor = isMorning ? '#3B82F6' : '#F59E0B'; // Blue vs Orange

//               return (
//                 <div key={index} className="card" style={styles.classRow}>
//                   {/* Time Column */}
//                   <div style={styles.timeCol}>
//                     <span style={{ fontSize: '14px', fontWeight: '700', color: '#1F2937' }}>
//                       {slot.time.split(' - ')[0]}
//                     </span>
//                     <span style={{ fontSize: '11px', color: '#9CA3AF' }}>
//                       {slot.time.split(' - ')[1]}
//                     </span>
//                   </div>

//                   {/* Divider Line */}
//                   <div style={{ ...styles.divider, background: accentColor }}></div>

//                   {/* Details */}
//                   <div style={{ flex: 1 }}>
//                     <div style={{ fontSize: '16px', fontWeight: '600', color: '#1F2937' }}>{subject}</div>
//                     <div style={{ fontSize: '13px', color: '#6B7280', marginTop: '4px', display: 'flex', alignItems: 'center', gap: '6px' }}>
//                       <span>📍 Room 302</span>
//                       <span>•</span>
//                       <span>Lecture</span>
//                     </div>
//                   </div>
//                 </div>
//               );
//             })}
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
//   dayCard: {
//     padding: '10px', marginBottom: '10px'
//   },
//   dayGrid: {
//     display: 'flex', justifyContent: 'space-between', gap: '5px'
//   },
//   dayBtn: {
//     flex: 1, padding: '10px 0', borderRadius: '12px', border: 'none',
//     cursor: 'pointer', transition: 'all 0.2s', display: 'flex', flexDirection: 'column', alignItems: 'center'
//   },
//   classRow: {
//     display: 'flex', alignItems: 'center', padding: '15px', marginBottom: '12px',
//     borderLeft: 'none' // We use a custom divider instead
//   },
//   timeCol: {
//     display: 'flex', flexDirection: 'column', width: '60px', textAlign: 'right', marginRight: '15px'
//   },
//   divider: {
//     width: '4px', height: '40px', borderRadius: '4px', marginRight: '15px'
//   }
// };

// export default Timetable;

// src/Timetable.jsx
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Moon, MapPin } from 'lucide-react';
import api from './api';

function Timetable() {
  const navigate = useNavigate();
  const [schedule, setSchedule] = useState([]);
  const [day, setDay] = useState(new Date().getDay()); // 0=Sun, 1=Mon...
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTimetable = async () => {
      try {
        const res = await api.get('/academic/timetable');
        setSchedule(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchTimetable();
  }, []);

  const dayKeys = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];
  const dayLabels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const currentDayKey = dayKeys[day];
  const displayDays = [1, 2, 3, 4, 5]; 

  return (
    <div>
      <div style={styles.header}>
        <button onClick={() => navigate('/dashboard')} style={styles.backBtn}>←</button>
        <h2 style={{ margin: 0, fontSize: '18px', color: 'white' }}>Weekly Schedule</h2>
        <div style={{ width: '32px' }}></div>
      </div>

      <div style={{ padding: '20px', marginTop: '-30px' }}>
        
        <div className="card" style={styles.dayCard}>
          <div style={styles.dayGrid}>
            {displayDays.map((d) => (
              <button 
                key={d} 
                onClick={() => setDay(d)} 
                style={{
                  ...styles.dayBtn,
                  background: day === d ? 'var(--primary)' : 'transparent',
                  color: day === d ? 'white' : '#6B7280',
                }}
              >
                <span style={{ fontSize: '12px', fontWeight: '500' }}>{dayLabels[d]}</span>
              </button>
            ))}
          </div>
          <div style={{ textAlign: 'center', marginTop: '10px', fontSize: '13px', color: '#6B7280', fontWeight: '500' }}>
            {dayLabels[day]}'s Classes
          </div>
        </div>

        {loading ? (
          <p style={{ textAlign: 'center', marginTop: '40px', color: '#9CA3AF' }}>Loading schedule...</p>
        ) : (
          <div style={{ marginTop: '20px' }}>
            
            {schedule.every(s => !s[currentDayKey] || s[currentDayKey] === '-') && (
              <div style={{ textAlign: 'center', padding: '40px 20px', color: '#9CA3AF' }}>
                <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '10px', opacity: 0.5 }}>
                   <Moon size={40} />
                </div>
                <p>No classes scheduled.</p>
              </div>
            )}

            {schedule.map((slot, index) => {
              const subject = slot[currentDayKey];
              if (!subject || subject === '-') return null;

              const isMorning = slot.time.includes('AM') || parseInt(slot.time) < 12;
              const accentColor = isMorning ? '#3B82F6' : '#F59E0B'; 

              return (
                <div key={index} className="card" style={styles.classRow}>
                  <div style={styles.timeCol}>
                    <span style={{ fontSize: '14px', fontWeight: '700', color: '#1F2937' }}>
                      {slot.time.split(' - ')[0]}
                    </span>
                    <span style={{ fontSize: '11px', color: '#9CA3AF' }}>
                      {slot.time.split(' - ')[1]}
                    </span>
                  </div>

                  <div style={{ ...styles.divider, background: accentColor }}></div>

                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '16px', fontWeight: '600', color: '#1F2937' }}>{subject}</div>
                    <div style={{ fontSize: '13px', color: '#6B7280', marginTop: '6px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <MapPin size={14} />
                      <span>Room 302</span>
                      <span>•</span>
                      <span>Lecture</span>
                    </div>
                  </div>
                </div>
              );
            })}
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
    width: '32px', height: '32px', borderRadius: '50%', cursor: 'pointer',
    userSelect: 'none', WebkitUserSelect: 'none'
  },
  dayCard: {
    padding: '10px', marginBottom: '10px'
  },
  dayGrid: {
    display: 'flex', justifyContent: 'space-between', gap: '5px'
  },
  dayBtn: {
    flex: 1, padding: '10px 0', borderRadius: '12px', border: 'none',
    cursor: 'pointer', transition: 'all 0.2s', display: 'flex', flexDirection: 'column', alignItems: 'center',
    userSelect: 'none', WebkitUserSelect: 'none' // Prevents highlighting
  },
  classRow: {
    display: 'flex', alignItems: 'center', padding: '15px', marginBottom: '12px',
    borderLeft: 'none' 
  },
  timeCol: {
    display: 'flex', flexDirection: 'column', width: '60px', textAlign: 'right', marginRight: '15px'
  },
  divider: {
    width: '4px', height: '40px', borderRadius: '4px', marginRight: '15px'
  }
};

export default Timetable;