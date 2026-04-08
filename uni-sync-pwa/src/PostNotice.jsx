// // src/PostNotice.jsx
// import { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import api from './api';

// function PostNotice() {
//   const navigate = useNavigate();
//   const [category, setCategory] = useState('announcement');
//   const [title, setTitle] = useState('');
//   const [content, setContent] = useState('');
//   const [loading, setLoading] = useState(false);

//   const handleSubmit = async () => {
//     if (!title || !content) return alert("Please fill all fields");
//     setLoading(true);
//     try {
//       await api.post('/announcements/', { title, content, category });
//       alert("✅ Notice Posted!");
//       navigate('/faculty');
//     } catch (err) {
//       alert("Failed to post notice.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const categories = [
//     { id: 'announcement', label: 'General' },
//     { id: 'hackathon', label: 'Hackathon' },
//     { id: 'internship', label: 'Internship' }
//   ];

//   return (
//     <div>
//       {/* Header */}
//       <div style={styles.header}>
//         <button onClick={() => navigate('/faculty')} style={styles.backBtn}>←</button>
//         <h2 style={{ margin: 0, fontSize: '18px', color: 'white' }}>New Notice</h2>
//         <div style={{ width: '32px' }}></div>
//       </div>

//       <div style={{ padding: '20px', marginTop: '-30px' }}>
        
//         {/* Main Form Card */}
//         <div className="card">
          
//           {/* Category Pills */}
//           <label style={styles.label}>Select Category</label>
//           <div style={styles.pillContainer}>
//             {categories.map(cat => (
//               <button
//                 key={cat.id}
//                 onClick={() => setCategory(cat.id)}
//                 style={{
//                   ...styles.pill,
//                   background: category === cat.id ? 'var(--primary)' : '#F3F4F6',
//                   color: category === cat.id ? 'white' : '#6B7280',
//                 }}
//               >
//                 {cat.label}
//               </button>
//             ))}
//           </div>

//           <div style={{ marginTop: '20px' }}>
//             <label style={styles.label}>Title</label>
//             <input 
//               type="text" 
//               className="input-field" 
//               placeholder="e.g., Exam Schedule Released"
//               value={title}
//               onChange={(e) => setTitle(e.target.value)}
//             />
//           </div>

//           <div>
//             <label style={styles.label}>Description</label>
//             <textarea 
//               className="input-field" 
//               rows="6"
//               placeholder="Enter all the details here..."
//               value={content}
//               onChange={(e) => setContent(e.target.value)}
//               style={{ resize: 'none', lineHeight: '1.5' }}
//             />
//           </div>

//           <button 
//             className="btn-primary" 
//             onClick={handleSubmit} 
//             disabled={loading}
//             style={{ marginTop: '10px' }}
//           >
//             {loading ? 'Posting...' : 'Publish Notice'}
//           </button>
//         </div>

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
//   label: { fontSize: '12px', fontWeight: '600', color: '#6B7280', marginBottom: '8px', display: 'block' },
//   pillContainer: {
//     display: 'flex', gap: '8px', background: '#F9FAFB', padding: '5px', borderRadius: '12px'
//   },
//   pill: {
//     flex: 1, padding: '10px', borderRadius: '8px', border: 'none',
//     fontSize: '13px', fontWeight: '600', cursor: 'pointer', transition: 'all 0.2s'
//   }
// };

// export default PostNotice;

// src/PostNotice.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from './api';

function PostNotice() {
  const navigate = useNavigate();
  const [category, setCategory] = useState('announcement');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!title || !content) return alert("Please fill all fields");
    setLoading(true);
    try {
      await api.post('/announcements/', { title, content, category });
      alert("✅ Notice Posted!");
      navigate('/faculty');
    } catch (err) {
      alert("Failed to post notice.");
    } finally {
      setLoading(false);
    }
  };

  const categories = [
    { id: 'announcement', label: 'General' },
    { id: 'hackathon', label: 'Hackathon' },
    { id: 'internship', label: 'Internship' }
  ];

  return (
    <div>
      <div style={styles.header}>
        <button onClick={() => navigate('/faculty')} style={styles.backBtn}>←</button>
        <h2 style={{ margin: 0, fontSize: '18px', color: 'white' }}>New Notice</h2>
        <div style={{ width: '32px' }}></div>
      </div>

      <div style={{ padding: '20px', marginTop: '-30px' }}>
        
        <div className="card">
          
          <label style={styles.label}>Select Category</label>
          <div style={styles.pillContainer}>
            {categories.map(cat => (
              <button
                key={cat.id}
                onClick={() => setCategory(cat.id)}
                style={{
                  ...styles.pill,
                  background: category === cat.id ? 'var(--primary)' : '#F3F4F6',
                  color: category === cat.id ? 'white' : '#6B7280',
                }}
              >
                {cat.label}
              </button>
            ))}
          </div>

          <div style={{ marginTop: '20px' }}>
            <label style={styles.label}>Title</label>
            <input 
              type="text" 
              className="input-field" 
              placeholder="e.g., Exam Schedule Released"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <div>
            <label style={styles.label}>Description</label>
            <textarea 
              className="input-field" 
              rows="6"
              placeholder="Enter all the details here..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              style={{ resize: 'none', lineHeight: '1.5' }}
            />
          </div>

          <button 
            className="btn-primary" 
            onClick={handleSubmit} 
            disabled={loading}
            style={{ marginTop: '10px', userSelect: 'none', WebkitUserSelect: 'none' }}
          >
            {loading ? 'Posting...' : 'Publish Notice'}
          </button>
        </div>

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
  label: { fontSize: '12px', fontWeight: '600', color: '#6B7280', marginBottom: '8px', display: 'block' },
  pillContainer: {
    display: 'flex', gap: '8px', background: '#F9FAFB', padding: '5px', borderRadius: '12px'
  },
  pill: {
    flex: 1, padding: '10px', borderRadius: '8px', border: 'none',
    fontSize: '13px', fontWeight: '600', cursor: 'pointer', transition: 'all 0.2s',
    userSelect: 'none', WebkitUserSelect: 'none'
  }
};

export default PostNotice;