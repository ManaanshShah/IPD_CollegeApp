// src/Hackathons.jsx
import { useState, useEffect } from 'react';
import api from './api';

function Hackathons() {
  const [notices, setNotices] = useState([]);
  const [filter, setFilter] = useState('all');

  // Dummy data fallback for demo
  const dummyData = [
    { id: 1, title: 'InnovateAI Hackathon 2026', category: 'hackathon', location: 'Mumbai', date: 'Ends Oct 25', desc: 'Join us for a weekend of innovation...', tags: ['Beginner'] },
    { id: 2, title: 'Software Engineer Intern', category: 'internship', location: 'Remote', date: 'Deadline: Nov 15', desc: 'Work on cutting-edge projects...', tags: ['Paid'] }
  ];

  useEffect(() => {
    api.get('/announcements/').then(res => {
      setNotices(res.data.length ? res.data : dummyData);
    }).catch(() => setNotices(dummyData));
  }, []);

  const filtered = filter === 'all' ? notices : notices.filter(n => n.category === filter);

  return (
    <div>
      <div className="app-header">
        <span></span>
        <h2 className="page-title">Opportunities</h2>
        <span>🔔</span>
      </div>

      <div style={{ padding: '20px' }}>
        {/* Filter Pills */}
        <div className="no-scrollbar" style={{ display: 'flex', gap: '10px', overflowX: 'auto', paddingBottom: '5px', marginBottom: '20px' }}>
          {['all', 'hackathon', 'internship', 'workshop'].map(f => (
            <button 
              key={f} 
              onClick={() => setFilter(f)}
              style={{ 
                padding: '8px 18px', borderRadius: '20px', border: 'none', 
                background: filter === f ? '#007bff' : 'white',
                color: filter === f ? 'white' : '#495057',
                fontWeight: '600', fontSize: '13px', textTransform: 'capitalize',
                boxShadow: '0 2px 5px rgba(0,0,0,0.05)', whiteSpace: 'nowrap'
              }}
            >
              {f}
            </button>
          ))}
        </div>

        {/* Event Cards */}
        {filtered.map((item, i) => (
          <div key={i} className="card">
            <h3 style={{ margin: '0 0 8px 0', fontSize: '16px' }}>{item.title}</h3>
            <div style={{ fontSize: '13px', color: '#6c757d', marginBottom: '12px', display: 'flex', gap: '15px' }}>
              <span>📍 {item.location || 'Online'}</span>
              <span>📅 {item.date || 'Upcoming'}</span>
            </div>
            <p style={{ fontSize: '14px', color: '#495057', lineHeight: '1.5', margin: '0 0 15px 0' }}>{item.content || item.desc}</p>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
               <span style={{ background: '#e6f2ff', color: '#007bff', fontSize: '11px', padding: '5px 10px', borderRadius: '6px', fontWeight: 'bold' }}>
                 {item.category.toUpperCase()}
               </span>
               <button className="btn-primary" style={{ width: 'auto', padding: '8px 16px' }}>View Details</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
export default Hackathons;