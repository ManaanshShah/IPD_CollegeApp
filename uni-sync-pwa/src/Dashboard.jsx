// // src/Dashboard.jsx
// import { useNavigate } from 'react-router-dom';
// import { useState, useEffect } from 'react';

// function Dashboard() {
//   const navigate = useNavigate();
//   const [user, setUser] = useState(null);

//   useEffect(() => {
//     try {
//       const storedUser = localStorage.getItem('user');
//       if (storedUser) {
//         setUser(JSON.parse(storedUser));
//       } else {
//         navigate('/login');
//       }
//     } catch (e) { 
//       console.error("Auth error", e);
//       navigate('/login'); 
//     }
//   }, [navigate]);

//   const handleLogout = () => {
//     localStorage.clear();
//     navigate('/login');
//   };

//   if (!user) return <div style={{ padding: '20px', textAlign: 'center', marginTop: '50px' }}>Loading Campus Hub...</div>;

//   // SAFE DATA ACCESS: Use full_name, and fallback to "Student" if missing
//   const displayName = user.full_name || user.username || "Student";
//   const displayRole = user.role === 'student' ? 'Student • Comp Eng' : 'Faculty Member';
//   const initial = displayName.charAt(0).toUpperCase();

//   return (
//     <div>
//       {/* Modern Header with Gradient */}
//       <div style={styles.header}>
//         <div>
//           <h2 style={{ margin: 0, color: 'white', fontSize: '22px' }}>Hello, {displayName} 👋</h2>
//           <p style={{ margin: '4px 0 0 0', color: 'rgba(255,255,255,0.8)', fontSize: '14px' }}>
//             {displayRole}
//           </p>
//         </div>
        
//         {/* Profile / Logout Icon */}
//         <div onClick={handleLogout} style={styles.profileIcon} title="Click to Logout">
//           {initial}
//         </div>
//       </div>

//       <div style={{ padding: '20px', marginTop: '-40px' }}>
        
//         {/* Main Grid */}
//         <div style={styles.grid}>
          
//           {/* Hackathons */}
//           <div className="card card-hover" onClick={() => navigate('/feed/hackathon')} style={styles.actionCard}>
//             <div style={styles.iconBox}>🚀</div>
//             <h3 style={styles.cardTitle}>Hackathons</h3>
//             <p style={styles.cardSub}>Compete & Win</p>
//           </div>

//           {/* Internships */}
//           <div className="card card-hover" onClick={() => navigate('/feed/internship')} style={styles.actionCard}>
//             <div style={styles.iconBox}>💼</div>
//             <h3 style={styles.cardTitle}>Internships</h3>
//             <p style={styles.cardSub}>Find Jobs</p>
//           </div>

//           {/* Notices */}
//           <div className="card card-hover" onClick={() => navigate('/feed/announcement')} style={styles.actionCard}>
//             <div style={styles.iconBox}>📌</div>
//             <h3 style={styles.cardTitle}>Notices</h3>
//             <p style={styles.cardSub}>Campus Updates</p>
//           </div>

//           {/* Marks (Student Only) */}
//           {user.role === 'student' && (
//             <div className="card card-hover" onClick={() => navigate('/student/marks')} style={styles.actionCard}>
//               <div style={styles.iconBox}>📊</div>
//               <h3 style={styles.cardTitle}>Results</h3>
//               <p style={styles.cardSub}>View Marks</p>
//             </div>
//           )}

//           {/* Faculty Only Tools */}
//           {user.role !== 'student' && (
//              <div className="card card-hover" onClick={() => navigate('/faculty')} style={styles.actionCard}>
//              <div style={styles.iconBox}>👨‍🏫</div>
//              <h3 style={styles.cardTitle}>Faculty</h3>
//              <p style={styles.cardSub}>Manage Class</p>
//            </div>
//           )}

//         </div>

//         {/* Recent Activity Section */}
//         <h3 style={{ fontSize: '16px', margin: '20px 0 15px', color: 'var(--text-muted)' }}>Quick Actions</h3>
        
//         <div className="card" onClick={() => navigate('/timetable')} style={{ display: 'flex', alignItems: 'center', cursor: 'pointer', padding: '15px' }}>
//           <div style={{ ...styles.iconBox, background: '#EFF6FF', color: 'var(--primary)', marginBottom: 0, marginRight: '15px' }}>📅</div>
//           <div>
//              <div style={{ fontWeight: '600' }}>Check Timetable</div>
//              <div style={{ fontSize: '13px', color: 'var(--text-muted)' }}>See your schedule for today</div>
//           </div>
//         </div>

//       </div>
//     </div>
//   );
// }

// const styles = {
//   header: {
//     background: 'var(--primary)',
//     padding: '30px 20px 60px 20px', // Extra padding bottom for overlap
//     display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start',
//     borderBottomLeftRadius: '24px', borderBottomRightRadius: '24px'
//   },
//   profileIcon: {
//     width: '40px', height: '40px', borderRadius: '50%',
//     background: 'rgba(255,255,255,0.2)', color: 'white',
//     display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold',
//     cursor: 'pointer'
//   },
//   grid: {
//     display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px'
//   },
//   actionCard: {
//     display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
//     textAlign: 'center', padding: '25px 15px', cursor: 'pointer', margin: 0
//   },
//   iconBox: {
//     width: '45px', height: '45px', borderRadius: '12px',
//     background: 'var(--bg-app)', fontSize: '22px',
//     display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '10px'
//   },
//   cardTitle: { margin: 0, fontSize: '16px', fontWeight: '600' },
//   cardSub: { margin: '4px 0 0 0', fontSize: '12px', color: 'var(--text-muted)' }
// };

// export default Dashboard;

// src/Dashboard.jsx
// src/Dashboard.jsx
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { Rocket, Briefcase, Bell, BarChart3, GraduationCap, CalendarDays } from 'lucide-react';

function Dashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    try {
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      } else {
        navigate('/login');
      }
    } catch (e) { 
      console.error("Auth error", e);
      navigate('/login'); 
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  if (!user) return <div style={{ padding: '20px', textAlign: 'center', marginTop: '50px' }}>Loading Campus Hub...</div>;

  const displayName = user.full_name || user.username || "Student";
  const displayRole = user.role === 'student' ? 'Student • Comp Eng' : 'Faculty Member';
  const initial = displayName.charAt(0).toUpperCase();

  return (
    <div>
      <div style={styles.header}>
        <div>
          <h2 style={{ margin: 0, color: 'white', fontSize: '22px' }}>Hello, {displayName} 👋</h2>
          <p style={{ margin: '4px 0 0 0', color: 'rgba(255,255,255,0.8)', fontSize: '14px' }}>
            {displayRole}
          </p>
        </div>
        
        <div onClick={handleLogout} style={styles.profileIcon} title="Click to Logout">
          {initial}
        </div>
      </div>

      <div style={{ padding: '20px', marginTop: '-40px' }}>
        
        <div style={styles.grid}>
          {/* Hackathons - Purple Theme */}
          <div className="card card-hover" onClick={() => navigate('/feed/hackathon')} style={styles.actionCard}>
            <div style={{ ...styles.iconBox, background: '#F3E8FF' }}>
               <Rocket size={26} color="#9333EA" />
            </div>
            <h3 style={styles.cardTitle}>Hackathons</h3>
            <p style={styles.cardSub}>Compete & Win</p>
          </div>

          {/* Internships - Orange Theme */}
          <div className="card card-hover" onClick={() => navigate('/feed/internship')} style={styles.actionCard}>
            <div style={{ ...styles.iconBox, background: '#FFEDD5' }}>
               <Briefcase size={26} color="#EA580C" />
            </div>
            <h3 style={styles.cardTitle}>Internships</h3>
            <p style={styles.cardSub}>Find Jobs</p>
          </div>

          {/* Notices - Amber/Yellow Theme */}
          <div className="card card-hover" onClick={() => navigate('/feed/announcement')} style={styles.actionCard}>
            <div style={{ ...styles.iconBox, background: '#FEF3C7' }}>
               <Bell size={26} color="#D97706" />
            </div>
            <h3 style={styles.cardTitle}>Notices</h3>
            <p style={styles.cardSub}>Campus Updates</p>
          </div>

          {/* Results - Green Theme (Student Only) */}
          {user.role === 'student' && (
            <div className="card card-hover" onClick={() => navigate('/student/marks')} style={styles.actionCard}>
              <div style={{ ...styles.iconBox, background: '#D1FAE5' }}>
                 <BarChart3 size={26} color="#059669" />
              </div>
              <h3 style={styles.cardTitle}>Results</h3>
              <p style={styles.cardSub}>View Marks</p>
            </div>
          )}

          {/* Faculty - Blue Theme (Faculty Only) */}
          {user.role !== 'student' && (
             <div className="card card-hover" onClick={() => navigate('/faculty')} style={styles.actionCard}>
             <div style={{ ...styles.iconBox, background: '#DBEAFE' }}>
                <GraduationCap size={26} color="#2563EB" />
             </div>
             <h3 style={styles.cardTitle}>Faculty</h3>
             <p style={styles.cardSub}>Manage Class</p>
           </div>
          )}
        </div>

        <h3 style={{ fontSize: '16px', margin: '20px 0 15px', color: 'var(--text-muted)' }}>Quick Actions</h3>
        
        {/* Quick Action - Rose/Red Theme */}
        <div className="card card-hover" onClick={() => navigate('/timetable')} style={styles.quickAction}>
          <div style={{ ...styles.iconBox, background: '#FFE4E6', marginBottom: 0, marginRight: '15px' }}>
             <CalendarDays size={24} color="#E11D48" />
          </div>
          <div>
             <div style={{ fontWeight: '600' }}>Check Timetable</div>
             <div style={{ fontSize: '13px', color: 'var(--text-muted)' }}>See your schedule for today</div>
          </div>
        </div>

      </div>
    </div>
  );
}

const styles = {
  header: {
    background: 'var(--primary)',
    padding: '30px 20px 60px 20px', 
    display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start',
    borderBottomLeftRadius: '24px', borderBottomRightRadius: '24px'
  },
  profileIcon: {
    width: '40px', height: '40px', borderRadius: '50%',
    background: 'rgba(255,255,255,0.2)', color: 'white',
    display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold',
    cursor: 'pointer', userSelect: 'none', WebkitUserSelect: 'none'
  },
  grid: {
    display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px'
  },
  actionCard: {
    display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
    textAlign: 'center', padding: '25px 15px', cursor: 'pointer', margin: 0,
    userSelect: 'none', WebkitUserSelect: 'none'
  },
  iconBox: {
    width: '48px', height: '48px', borderRadius: '12px',
    display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '12px'
  },
  cardTitle: { margin: 0, fontSize: '16px', fontWeight: '600' },
  cardSub: { margin: '4px 0 0 0', fontSize: '12px', color: 'var(--text-muted)' },
  quickAction: {
    display: 'flex', alignItems: 'center', cursor: 'pointer', padding: '15px', margin: 0,
    userSelect: 'none', WebkitUserSelect: 'none' 
  }
};

export default Dashboard;