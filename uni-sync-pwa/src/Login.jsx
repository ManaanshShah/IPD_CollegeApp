// // src/Login.jsx
// import { useState } from 'react';
// import api from './api'; 
// import { useNavigate } from 'react-router-dom';

// function Login() {
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [error, setError] = useState('');
//   const [loading, setLoading] = useState(false);
//   const navigate = useNavigate();

//   const handleLogin = async (e) => {
//     e.preventDefault(); 
//     setError('');
//     setLoading(true);

//     const formData = new URLSearchParams();
//     formData.append('username', email); 
//     formData.append('password', password);

//     try {
//       const response = await api.post('/token', formData);
//       localStorage.setItem('token', response.data.access_token);

//       const userResponse = await api.get('/me'); 
//       localStorage.setItem('user', JSON.stringify(userResponse.data));
      
//       navigate('/dashboard');
//     } catch (err) {
//       setError('Invalid email or password.');
//       localStorage.removeItem('token'); 
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div style={styles.container}>
//       {/* Decorative Blue Background Shape */}
//       <div style={styles.blueHeader}></div>

//       <div style={styles.content}>
//         <div className="card" style={styles.loginCard}>
//           {/* Logo / Icon Area */}
//           <div style={styles.logoCircle}>
//             🎓
//           </div>
          
//           <h2 style={{ margin: '10px 0 5px', fontSize: '24px' }}>Welcome Back</h2>
//           <p style={{ color: 'var(--text-muted)', marginBottom: '30px' }}>Sign in to UniSync</p>

//           <form onSubmit={handleLogin} style={{ width: '100%' }}>
//             <div style={{ marginBottom: '15px', textAlign: 'left' }}>
//               <label style={styles.label}>Email Address</label>
//               <input 
//                 type="email" 
//                 className="input-field"
//                 placeholder="student@uni.edu" 
//                 value={email}
//                 onChange={(e) => setEmail(e.target.value)}
//                 required
//               />
//             </div>
            
//             <div style={{ marginBottom: '25px', textAlign: 'left' }}>
//               <label style={styles.label}>Password</label>
//               <input 
//                 type="password" 
//                 className="input-field"
//                 placeholder="••••••••" 
//                 value={password}
//                 onChange={(e) => setPassword(e.target.value)}
//                 required
//               />
//             </div>
            
//             <button type="submit" className="btn-primary" disabled={loading}>
//               {loading ? 'Signing in...' : 'Sign In'}
//             </button>
            
//             {error && <div style={styles.errorAlert}>{error}</div>}
//           </form>
//         </div>
//       </div>
//     </div>
//   );
// }

// const styles = {
//   container: { 
//     minHeight: '100vh', 
//     background: 'var(--bg-app)', 
//     position: 'relative',
//     display: 'flex',
//     justifyContent: 'center',
//     alignItems: 'center'
//   },
//   blueHeader: {
//     position: 'absolute', top: 0, left: 0, right: 0, height: '250px',
//     background: 'var(--primary)',
//     borderBottomLeftRadius: '40px', borderBottomRightRadius: '40px'
//   },
//   content: {
//     zIndex: 10, width: '100%', padding: '20px', display: 'flex', justifyContent: 'center'
//   },
//   loginCard: {
//     width: '100%', maxWidth: '380px', padding: '40px 30px',
//     display: 'flex', flexDirection: 'column', alignItems: 'center',
//     boxShadow: 'var(--shadow-lg)'
//   },
//   logoCircle: {
//     width: '60px', height: '60px', borderRadius: '50%',
//     background: 'var(--bg-app)', color: 'var(--primary)',
//     display: 'flex', alignItems: 'center', justifyContent: 'center',
//     fontSize: '30px', marginBottom: '15px'
//   },
//   label: {
//     display: 'block', fontSize: '13px', fontWeight: '600', 
//     color: 'var(--text-main)', marginBottom: '6px'
//   },
//   errorAlert: {
//     marginTop: '15px', padding: '10px', borderRadius: '8px',
//     background: '#FEE2E2', color: '#B91C1C', fontSize: '14px'
//   }
// };

// export default Login;

// src/Login.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { GraduationCap } from 'lucide-react';
import api from './api'; 

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault(); 
    setError('');
    setLoading(true);

    const formData = new URLSearchParams();
    formData.append('username', email); 
    formData.append('password', password);

    try {
      const response = await api.post('/token', formData);
      localStorage.setItem('token', response.data.access_token);

      const userResponse = await api.get('/me'); 
      localStorage.setItem('user', JSON.stringify(userResponse.data));
      
      navigate('/dashboard');
    } catch (err) {
      setError('Invalid email or password.');
      localStorage.removeItem('token'); 
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      {/* Decorative Blue Background Shape */}
      <div style={styles.blueHeader}></div>

      <div style={styles.content}>
        <div className="card" style={styles.loginCard}>
          {/* Logo / Icon Area */}
          <div style={styles.logoCircle}>
            <GraduationCap size={32} color="var(--primary)" />
          </div>
          
          <h2 style={{ margin: '10px 0 5px', fontSize: '24px' }}>Welcome Back</h2>
          <p style={{ color: 'var(--text-muted)', marginBottom: '30px' }}>Sign in to UniSync</p>

          <form onSubmit={handleLogin} style={{ width: '100%' }}>
            <div style={{ marginBottom: '15px', textAlign: 'left' }}>
              <label style={styles.label}>Email Address</label>
              <input 
                type="email" 
                className="input-field"
                placeholder="student@uni.edu" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            
            <div style={{ marginBottom: '25px', textAlign: 'left' }}>
              <label style={styles.label}>Password</label>
              <input 
                type="password" 
                className="input-field"
                placeholder="••••••••" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            
            <button type="submit" className="btn-primary" disabled={loading} style={{ userSelect: 'none', WebkitUserSelect: 'none' }}>
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
            
            {error && <div style={styles.errorAlert}>{error}</div>}
          </form>
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: { 
    minHeight: '100vh', 
    background: 'var(--bg-app)', 
    position: 'relative',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  },
  blueHeader: {
    position: 'absolute', top: 0, left: 0, right: 0, height: '250px',
    background: 'var(--primary)',
    borderBottomLeftRadius: '40px', borderBottomRightRadius: '40px'
  },
  content: {
    zIndex: 10, width: '100%', padding: '20px', display: 'flex', justifyContent: 'center'
  },
  loginCard: {
    width: '100%', maxWidth: '380px', padding: '40px 30px',
    display: 'flex', flexDirection: 'column', alignItems: 'center',
    boxShadow: 'var(--shadow-lg)'
  },
  logoCircle: {
    width: '60px', height: '60px', borderRadius: '50%',
    background: 'var(--bg-app)', color: 'var(--primary)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    marginBottom: '15px'
  },
  label: {
    display: 'block', fontSize: '13px', fontWeight: '600', 
    color: 'var(--text-main)', marginBottom: '6px'
  },
  errorAlert: {
    marginTop: '15px', padding: '10px', borderRadius: '8px',
    background: '#FEE2E2', color: '#B91C1C', fontSize: '14px'
  }
};

export default Login;