// // src/Feed.jsx
// import { useState, useEffect } from 'react';
// import { useParams, useNavigate } from 'react-router-dom';
// import api from './api';

// function Feed() {
//   const { category } = useParams(); // Gets 'hackathon', 'internship', etc. from URL
//   const navigate = useNavigate();
//   const [notices, setNotices] = useState([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchNotices = async () => {
//       try {
//         const res = await api.get('/announcements/');
//         // Filter the list based on the URL category
//         const filtered = res.data.filter(n => n.category === category);
//         setNotices(filtered);
//       } catch (err) {
//         console.error(err);
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchNotices();
//   }, [category]);

//   // Capitalize title (e.g., "hackathon" -> "Hackathon")
//   const title = category.charAt(0).toUpperCase() + category.slice(1) + 's';

//   return (
//     <div>
//       <div className="app-header">
//         <button onClick={() => navigate('/dashboard')} style={{ background: 'none', border: 'none', fontSize: '20px', cursor: 'pointer' }}>←</button>
//         <h2 className="page-title">{title}</h2>
//         <span>🔔</span>
//       </div>

//       <div style={{ padding: '20px' }}>
//         {loading ? <p>Loading...</p> : notices.length === 0 ? <p>No {category}s found.</p> : (
//           notices.map((item, i) => (
//             <div key={i} className="card">
//               <h3 style={{ margin: '0 0 8px 0', fontSize: '16px' }}>{item.title}</h3>
//               <p style={{ fontSize: '14px', color: '#555', lineHeight: '1.5' }}>{item.content}</p>
//               <div style={{ marginTop: '10px', display: 'flex', justifyContent: 'space-between' }}>
//                 <span style={{ fontSize: '12px', color: '#999' }}>{new Date(item.posted_at).toLocaleDateString()}</span>
//                 <button className="btn-primary" style={{ width: 'auto', padding: '6px 12px', fontSize: '12px' }}>View</button>
//               </div>
//             </div>
//           ))
//         )}
//       </div>
//     </div>
//   );
// }

// export default Feed;

// src/Feed.jsx
// src/Feed.jsx
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Bell } from 'lucide-react';
import api from './api';

function Feed() {
  const { category } = useParams(); 
  const navigate = useNavigate();
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNotices = async () => {
      try {
        const res = await api.get('/announcements/');
        const filtered = res.data.filter(n => n.category === category);
        setNotices(filtered);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchNotices();
  }, [category]);

  const title = category.charAt(0).toUpperCase() + category.slice(1) + 's';

  return (
    <div>
      <div className="app-header">
        <button onClick={() => navigate('/dashboard')} style={{ background: 'none', border: 'none', fontSize: '20px', cursor: 'pointer', userSelect: 'none', WebkitUserSelect: 'none' }}>←</button>
        <h2 className="page-title">{title}</h2>
        <Bell size={22} color="var(--text-main)" />
      </div>

      <div style={{ padding: '20px' }}>
        {loading ? <p>Loading...</p> : notices.length === 0 ? <p>No {category}s found.</p> : (
          notices.map((item, i) => (
            <div key={i} className="card">
              <h3 style={{ margin: '0 0 8px 0', fontSize: '16px' }}>{item.title}</h3>
              {/* Truncated text so it looks neat on the feed */}
              <p style={{ fontSize: '14px', color: '#555', lineHeight: '1.5', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                {item.content}
              </p>
              <div style={{ marginTop: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '12px', color: '#999' }}>{new Date(item.posted_at).toLocaleDateString()}</span>
                {/* ---> NEW NAVIGATION LOGIC HERE <--- */}
                <button 
                  className="btn-primary" 
                  onClick={() => navigate(`/notice/${item.id}`, { state: item })}
                  style={{ width: 'auto', padding: '6px 12px', fontSize: '12px', userSelect: 'none', WebkitUserSelect: 'none' }}
                >
                  View
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default Feed;