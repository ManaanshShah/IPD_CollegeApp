// // src/Profile.jsx
// import { useEffect, useState } from 'react';
// import api from './api';

// function Profile() {
//   const [user, setUser] = useState(null);

//   useEffect(() => {
//     api.get('/me').then(res => setUser(res.data)).catch(err => console.error(err));
//   }, []);

//   if (!user) return <p style={{textAlign:'center', marginTop:'50px'}}>Loading...</p>;

//   return (
//     <div>
//       <div className="app-header">
//         <span></span>
//         <h2 className="page-title">Profile</h2>
//         <span>⚙️</span>
//       </div>

//       <div style={{ padding: '20px' }}>
//         {/* Avatar */}
//         <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '30px' }}>
//           <div style={{ 
//             width: '100px', height: '100px', background: '#e9ecef', borderRadius: '50%', 
//             display: 'flex', alignItems: 'center', justifyContent: 'center', 
//             fontSize: '40px', color: '#007bff', fontWeight: 'bold', border: '4px solid white', boxShadow: '0 4px 10px rgba(0,0,0,0.1)' 
//           }}>
//             {user.full_name[0]}
//           </div>
//         </div>

//         {/* Form Fields */}
//         <div className="card">
//           <Field label="Full Name" value={user.full_name} />
//           <Field label="Email" value={user.email} />
//           <Field label="Branch" value={user.branch_name} />
//           <Field label="Class" value={user.class_name || 'N/A'} />
//           <Field label="Roll Number" value={user.student_id_code} />
//         </div>

//         <button className="btn-primary" style={{ background: 'white', color: '#dc3545', border: '1px solid #dc3545', marginTop: '10px' }} 
//           onClick={() => { localStorage.removeItem('token'); window.location.href='/'; }}>
//           Logout
//         </button>
//       </div>
//     </div>
//   );
// }

// const Field = ({ label, value }) => (
//   <div style={{ marginBottom: '15px' }}>
//     <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '6px', color: '#495057' }}>{label}</label>
//     <input type="text" value={value} readOnly className="input-field" style={{ margin: 0 }} />
//   </div>
// );

// export default Profile;

// src/Profile.jsx
import { useEffect, useState } from 'react';
import { Settings } from 'lucide-react';
import api from './api';

function Profile() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    api.get('/me').then(res => setUser(res.data)).catch(err => console.error(err));
  }, []);

  if (!user) return <p style={{textAlign:'center', marginTop:'50px'}}>Loading...</p>;

  return (
    <div>
      <div className="app-header">
        <span></span>
        <h2 className="page-title">Profile</h2>
        <Settings size={22} color="var(--text-main)" />
      </div>

      <div style={{ padding: '20px' }}>
        {/* Avatar */}
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '30px' }}>
          <div style={{ 
            width: '100px', height: '100px', background: '#e9ecef', borderRadius: '50%', 
            display: 'flex', alignItems: 'center', justifyContent: 'center', 
            fontSize: '40px', color: '#007bff', fontWeight: 'bold', border: '4px solid white', boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
            userSelect: 'none', WebkitUserSelect: 'none' // Prevents highlighting
          }}>
            {user.full_name[0]}
          </div>
        </div>

        {/* Form Fields */}
        <div className="card">
          <Field label="Full Name" value={user.full_name} />
          <Field label="Email" value={user.email} />
          <Field label="Branch" value={user.branch_name} />
          <Field label="Class" value={user.class_name || 'N/A'} />
          <Field label="Roll Number" value={user.student_id_code} />
        </div>

        <button className="btn-primary" style={{ background: 'white', color: '#dc3545', border: '1px solid #dc3545', marginTop: '10px', userSelect: 'none', WebkitUserSelect: 'none' }} 
          onClick={() => { localStorage.removeItem('token'); window.location.href='/'; }}>
          Logout
        </button>
      </div>
    </div>
  );
}

const Field = ({ label, value }) => (
  <div style={{ marginBottom: '15px' }}>
    <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '6px', color: '#495057' }}>{label}</label>
    <input type="text" value={value || ''} readOnly className="input-field" style={{ margin: 0 }} />
  </div>
);

export default Profile;