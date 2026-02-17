// src/Faculty.jsx
import { useNavigate } from 'react-router-dom';

function Faculty() {
  const navigate = useNavigate();

  return (
    <div>
      {/* 1. Header with Gradient */}
      <div style={styles.header}>
        <button onClick={() => navigate('/dashboard')} style={styles.backBtn}>←</button>
        <h2 style={{ margin: 0, fontSize: '20px', fontWeight: '600' }}>Faculty Tools</h2>
        <div style={{ width: '32px' }}></div> {/* Spacer for alignment */}
      </div>

      <div style={{ padding: '20px', marginTop: '-30px' }}>
        
        {/* 2. Main Tools Grid */}
        <div style={styles.sectionTitle}>Daily Operations</div>
        <div style={styles.grid}>
          
          <ToolCard 
            title="Mark Attendance" 
            desc="Record daily logs"
            icon="📝" 
            color="#EFF6FF" // Soft Blue
            onClick={() => navigate('/mark-attendance')} 
          />
          
          <ToolCard 
            title="Update Marks" 
            desc="Exam results"
            icon="📈" 
            color="#ECFDF5" // Soft Green
            onClick={() => navigate('/update-marks')} 
          />
          
          <ToolCard 
            title="Post Notice" 
            desc="Announcements"
            icon="📢" 
            color="#FFFBEB" // Soft Yellow
            onClick={() => navigate('/post-notice')} 
          />
          
          <ToolCard 
            title="My Schedule" 
            desc="View timetable"
            icon="📅" 
            color="#FEF2F2" // Soft Red
            onClick={() => navigate('/timetable')} 
          />

        </div>

        {/* 3. Advanced / Analytics Section (Placeholder for future) */}
        <div style={styles.sectionTitle}>Analytics & Reports</div>
        <div className="card" style={{ display: 'flex', alignItems: 'center', padding: '15px', opacity: 0.7 }}>
           <div style={{ fontSize: '24px', marginRight: '15px' }}>📉</div>
           <div>
              <div style={{ fontWeight: '600', color: '#374151' }}>Defaulter List</div>
              <div style={{ fontSize: '13px', color: '#6B7280' }}>Coming Soon</div>
           </div>
        </div>

      </div>
    </div>
  );
}

// Reusable Tool Card Component
const ToolCard = ({ title, desc, icon, color, onClick }) => (
  <div onClick={onClick} className="card card-hover" style={{ ...styles.card, cursor: 'pointer' }}>
    <div style={{ ...styles.iconBox, background: color }}>{icon}</div>
    <h3 style={{ margin: '0 0 4px 0', fontSize: '15px', fontWeight: '600', color: '#1F2937' }}>{title}</h3>
    <p style={{ margin: 0, fontSize: '12px', color: '#6B7280' }}>{desc}</p>
  </div>
);

const styles = {
  header: {
    background: 'var(--primary)',
    color: 'white',
    padding: '20px 20px 50px 20px', // Tall header
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    borderBottomLeftRadius: '24px', borderBottomRightRadius: '24px'
  },
  backBtn: {
    background: 'rgba(255,255,255,0.2)', border: 'none', color: 'white',
    width: '32px', height: '32px', borderRadius: '50%', cursor: 'pointer',
    display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px'
  },
  sectionTitle: {
    fontSize: '14px', fontWeight: '600', color: '#6B7280', 
    textTransform: 'uppercase', letterSpacing: '0.5px',
    margin: '20px 0 10px 0'
  },
  grid: {
    display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px'
  },
  card: {
    display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
    textAlign: 'center', padding: '20px 15px', margin: 0, border: '1px solid #E5E7EB'
  },
  iconBox: {
    width: '48px', height: '48px', borderRadius: '12px',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontSize: '22px', marginBottom: '12px'
  }
};

export default Faculty;