import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from './api';

function StudentAnnouncements() {
  const [notices, setNotices] = useState([]);
  const [filter, setFilter] = useState('all'); // 'all', 'announcement', 'hackathon', 'internship'
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchNotices = async () => {
      try {
        const res = await api.get('/announcements/');
        setNotices(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchNotices();
  }, []);

  // Filter Logic
  const filteredNotices = notices.filter(n => 
    filter === 'all' ? true : n.category === filter
  );

  return (
    <div style={styles.container}>
      {/* Header */}
      <header style={styles.header}>
        <button onClick={() => navigate('/dashboard')} style={styles.backBtn}>←</button>
        <h2 style={{margin: 0}}>📢 Campus Hub</h2>
      </header>

      {/* TABS for Bifurcation */}
      <div style={styles.tabs}>
        <button 
          style={filter === 'all' ? styles.activeTab : styles.tab} 
          onClick={() => setFilter('all')}
        >
          All
        </button>
        <button 
          style={filter === 'hackathon' ? styles.activeTab : styles.tab} 
          onClick={() => setFilter('hackathon')}
        >
          🚀 Hackathons
        </button>
        <button 
          style={filter === 'internship' ? styles.activeTab : styles.tab} 
          onClick={() => setFilter('internship')}
        >
          💼 Internships
        </button>
        <button 
          style={filter === 'announcement' ? styles.activeTab : styles.tab} 
          onClick={() => setFilter('announcement')}
        >
          📌 Notices
        </button>
      </div>

      {/* CONTENT */}
      {loading ? (
        <p style={{textAlign: 'center', marginTop: '20px'}}>Loading updates...</p>
      ) : (
        <div style={styles.feed}>
          {filteredNotices.length === 0 && <p style={{textAlign: 'center', color: '#888'}}>No updates in this category.</p>}
          
          {filteredNotices.map((notice) => (
            <div key={notice.id} style={styles.card}>
              <div style={styles.cardHeader}>
                <span style={getBadgeStyle(notice.category)}>
                  {notice.category.toUpperCase()}
                </span>
                <span style={styles.date}>
                  {new Date(notice.posted_at).toLocaleDateString()}
                </span>
              </div>
              <h3 style={styles.title}>{notice.title}</h3>
              <p style={styles.body}>{notice.content}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// Helper to color-code badges
const getBadgeStyle = (category) => {
  const base = { fontSize: '10px', padding: '4px 8px', borderRadius: '12px', fontWeight: 'bold', color: 'white' };
  switch (category) {
    case 'hackathon': return { ...base, background: '#8e44ad' }; // Purple
    case 'internship': return { ...base, background: '#e67e22' }; // Orange
    default: return { ...base, background: '#3498db' }; // Blue
  }
};

const styles = {
  container: { padding: '20px', maxWidth: '600px', margin: '0 auto', fontFamily: '-apple-system, sans-serif' },
  header: { display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '20px' },
  backBtn: { background: 'none', border: 'none', fontSize: '24px', cursor: 'pointer' },
  
  tabs: { display: 'flex', gap: '10px', overflowX: 'auto', paddingBottom: '10px', marginBottom: '15px', scrollbarWidth: 'none' },
  tab: { padding: '8px 16px', borderRadius: '20px', border: '1px solid #ddd', background: 'white', cursor: 'pointer', whiteSpace: 'nowrap' },
  activeTab: { padding: '8px 16px', borderRadius: '20px', border: 'none', background: '#222', color: 'white', cursor: 'pointer', whiteSpace: 'nowrap' },

  feed: { display: 'flex', flexDirection: 'column', gap: '15px' },
  card: { background: 'white', padding: '20px', borderRadius: '12px', boxShadow: '0 2px 10px rgba(0,0,0,0.05)', border: '1px solid #f0f0f0' },
  cardHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' },
  date: { fontSize: '12px', color: '#999' },
  title: { margin: '0 0 8px 0', fontSize: '18px', color: '#333' },
  body: { margin: 0, color: '#555', fontSize: '14px', lineHeight: '1.5' }
};

export default StudentAnnouncements;