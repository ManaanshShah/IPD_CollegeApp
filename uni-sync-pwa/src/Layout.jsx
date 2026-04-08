// // src/Layout.jsx
// import { Outlet, useNavigate, useLocation } from 'react-router-dom';
// import { useEffect, useState } from 'react';
// import api from './api';

// function Layout() {
//   const navigate = useNavigate();
//   const location = useLocation();
//   const [role, setRole] = useState(null); // 'student' or 'teacher'

//   // Fetch user role on load to decide which tabs to show
//   useEffect(() => {
//     const checkUser = async () => {
//       try {
//         const res = await api.get('/me');
//         setRole(res.data.role); // Assuming backend returns "role": "student"
//       } catch (err) {
//         console.error("Auth check failed", err);
//         navigate('/'); // Redirect to login if session fails
//       }
//     };
//     checkUser();
//   }, [navigate]);

//   const isActive = (path) => location.pathname === path;

//   if (!role) return null; // Wait for role to load

//   return (
//     <div style={{ maxWidth: '480px', margin: '0 auto', minHeight: '100vh', background: '#f8f9fa', position: 'relative' }}>
//       <Outlet />

//       {/* BOTTOM NAVIGATION BAR */}
//       <div style={styles.navBar}>
        
//         {/* 1. CALENDAR (Everyone) */}
//         <NavItem 
//           icon="📅" label="Calendar" 
//           active={isActive('/timetable')} 
//           onClick={() => navigate('/timetable')} 
//         />

//         {/* 2. ATTENDANCE (Students Only) */}
//         {role === 'student' && (
//           <NavItem 
//             icon="📊" label="Attendance" 
//             active={isActive('/attendance')} 
//             onClick={() => navigate('/attendance')} 
//           />
//         )}

//         {/* 3. HOME / DASHBOARD (Center - Everyone) */}
//         <NavItem 
//           icon="🏠" label="Home" 
//           active={isActive('/dashboard')} 
//           onClick={() => navigate('/dashboard')} 
//         />

//         {/* 4. FACULTY TOOLS (Teachers Only) */}
//         {role !== 'student' && (
//           <NavItem 
//             icon="🎓" label="Faculty" 
//             active={isActive('/faculty')} 
//             onClick={() => navigate('/faculty')} 
//           />
//         )}

//         {/* 5. PROFILE (Everyone) */}
//         <NavItem 
//           icon="👤" label="Profile" 
//           active={isActive('/profile')} 
//           onClick={() => navigate('/profile')} 
//         />

//       </div>
//     </div>
//   );
// }

// function NavItem({ icon, label, active, onClick }) {
//   return (
//     <div onClick={onClick} style={{ ...styles.navItem, color: active ? '#007bff' : '#adb5bd' }}>
//       <div style={{ fontSize: '22px', marginBottom: '4px' }}>{icon}</div>
//       <div style={{ fontSize: '10px', fontWeight: '600' }}>{label}</div>
//     </div>
//   );
// }

// const styles = {
//   navBar: {
//     position: 'fixed', bottom: 0, left: 0, right: 0,
//     background: 'white', borderTop: '1px solid #eee',
//     display: 'flex', justifyContent: 'space-around',
//     padding: '12px 0 20px 0', zIndex: 1000,
//     maxWidth: '480px', margin: '0 auto',
//     boxShadow: '0 -4px 20px rgba(0,0,0,0.03)'
//   },
//   navItem: {
//     display: 'flex', flexDirection: 'column', alignItems: 'center', cursor: 'pointer', flex: 1
//   }
// };

// export default Layout;

// src/Layout.jsx
// src/Layout.jsx
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Calendar, ClipboardCheck, Home, GraduationCap, UserCircle } from 'lucide-react';
import api from './api';

function Layout() {
  const navigate = useNavigate();
  const location = useLocation();
  const [role, setRole] = useState(null);

  useEffect(() => {
    const checkUser = async () => {
      try {
        const res = await api.get('/me');
        setRole(res.data.role); 
      } catch (err) {
        console.error("Auth check failed", err);
        navigate('/'); 
      }
    };
    checkUser();
  }, [navigate]);

  const isActive = (path) => location.pathname === path;

  if (!role) return null;

  return (
    <div style={{ maxWidth: '480px', margin: '0 auto', minHeight: '100vh', background: 'var(--bg-app)', position: 'relative', paddingBottom: '80px' }}>
      <Outlet />

      <div style={styles.navBar}>
        <NavItem 
          Icon={Calendar} label="Schedule" 
          active={isActive('/timetable')} 
          onClick={() => navigate('/timetable')} 
        />

        {role === 'student' && (
          <NavItem 
            Icon={ClipboardCheck} label="Attendance" 
            active={isActive('/attendance')} 
            onClick={() => navigate('/attendance')} 
          />
        )}

        <NavItem 
          Icon={Home} label="Home" 
          active={isActive('/dashboard')} 
          onClick={() => navigate('/dashboard')} 
        />

        {role !== 'student' && (
          <NavItem 
            Icon={GraduationCap} label="Faculty" 
            active={isActive('/faculty')} 
            onClick={() => navigate('/faculty')} 
          />
        )}

        <NavItem 
          Icon={UserCircle} label="Profile" 
          active={isActive('/profile')} 
          onClick={() => navigate('/profile')} 
        />
      </div>
    </div>
  );
}

function NavItem({ Icon, label, active, onClick }) {
  return (
    <div onClick={onClick} style={styles.navItem}>
      {/* Icon Wrapper (The "Pill") */}
      <div style={{
        ...styles.iconWrapper,
        background: active ? '#EFF6FF' : 'transparent',
        color: active ? 'var(--primary)' : '#6B7280',
      }}>
        <Icon size={22} strokeWidth={active ? 2.5 : 2} />
      </div>
      
      {/* Label */}
      <span style={{
        fontSize: '11px',
        fontWeight: active ? '700' : '500',
        color: active ? 'var(--primary)' : '#9CA3AF',
        marginTop: '4px',
        transition: 'all 0.2s ease'
      }}>
        {label}
      </span>
    </div>
  );
}

const styles = {
  navBar: {
    position: 'fixed', bottom: 0, left: 0, right: 0,
    background: 'white',
    display: 'flex', justifyContent: 'space-around', alignItems: 'center',
    padding: '12px 10px 25px 10px', // Extra bottom padding for modern phones
    zIndex: 1000,
    maxWidth: '480px', margin: '0 auto',
    borderTopLeftRadius: '24px', borderTopRightRadius: '24px', // Rounded top corners
    boxShadow: '0 -10px 25px rgba(0,0,0,0.06)', // Floating upward shadow
    userSelect: 'none', WebkitUserSelect: 'none' 
  },
  navItem: {
    display: 'flex', flexDirection: 'column', alignItems: 'center', cursor: 'pointer', flex: 1,
    userSelect: 'none', WebkitUserSelect: 'none',
    WebkitTapHighlightColor: 'transparent' // Completely kills tap flashes
  },
  iconWrapper: {
    width: '50px', height: '32px',
    borderRadius: '16px',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    transition: 'all 0.2s ease' // Smooth transition when clicking
  }
};

export default Layout;