// src/NoticeDetails.jsx
import { useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeft, CalendarDays, MapPin } from 'lucide-react';

function NoticeDetails() {
  const { state } = useLocation(); 
  const navigate = useNavigate();

  if (!state) {
    return (
      <div style={{ padding: '40px 20px', textAlign: 'center' }}>
        <p style={{ color: '#6B7280' }}>Notice not found or session expired.</p>
        <button onClick={() => navigate(-1)} className="btn-primary" style={{ width: 'auto' }}>Go Back</button>
      </div>
    );
  }

  const displayDate = state.posted_at 
    ? new Date(state.posted_at).toLocaleDateString() 
    : state.date || 'Recently';

  // ---> NEW: The Magic Linkify Function <---
  const renderContentWithLinks = (text) => {
    if (!text) return null;
    
    // This regex looks for anything starting with http:// or https://
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    
    // Split the text into parts based on the URLs
    const parts = text.split(urlRegex);
    
    return parts.map((part, index) => {
      if (part.match(urlRegex)) {
        // If the part is a URL, return a clickable blue link!
        return (
          <a 
            key={index} 
            href={part} 
            target="_blank" 
            rel="noopener noreferrer" 
            style={{ color: '#2563EB', textDecoration: 'underline', fontWeight: '500' }}
          >
            {part}
          </a>
        );
      }
      // Otherwise, just return the normal text
      return part;
    });
  };

  return (
    <div style={{ paddingBottom: '90px', background: 'var(--bg-app)', minHeight: '100vh' }}>
       {/* Top Header */}
       <div style={styles.header}>
         <button onClick={() => navigate(-1)} style={styles.backBtn}>
           <ArrowLeft size={20} />
         </button>
         <h2 style={{ margin: 0, fontSize: '18px', fontWeight: '600' }}>Details</h2>
         <div style={{ width: '32px' }}></div> 
       </div>

       {/* Content Card */}
       <div style={{ padding: '20px', marginTop: '-20px' }}>
          <div className="card" style={{ padding: '25px', borderTopLeftRadius: '0', borderTopRightRadius: '0' }}>
            
            <span style={{ background: '#EFF6FF', color: '#2563EB', fontSize: '11px', padding: '6px 12px', borderRadius: '8px', fontWeight: 'bold', textTransform: 'uppercase' }}>
               {state.category}
            </span>
            
            <h1 style={{ margin: '15px 0 10px 0', fontSize: '22px', color: '#1F2937', lineHeight: '1.3' }}>
              {state.title}
            </h1>
            
            <div style={{ fontSize: '13px', color: '#6B7280', marginBottom: '25px', display: 'flex', gap: '15px', flexWrap: 'wrap' }}>
               <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                 <CalendarDays size={16} /> {displayDate}
               </span>
               {state.location && (
                 <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                   <MapPin size={16} /> {state.location}
                 </span>
               )}
            </div>
            
            <div style={{ height: '1px', background: '#E5E7EB', marginBottom: '20px' }}></div>

            {/* ---> NEW: Use the helper function to render the body <--- */}
            <div style={{ fontSize: '15px', lineHeight: '1.7', color: '#4B5563', whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
               {renderContentWithLinks(state.content || state.desc)}
            </div>

          </div>
       </div>
    </div>
  );
}

const styles = {
  header: {
    background: 'var(--primary)', padding: '20px 20px 50px 20px', 
    display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: 'white',
    borderBottomLeftRadius: '24px', borderBottomRightRadius: '24px'
  },
  backBtn: {
    background: 'rgba(255,255,255,0.2)', border: 'none', color: 'white',
    width: '36px', height: '36px', borderRadius: '50%', cursor: 'pointer',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    userSelect: 'none', WebkitUserSelect: 'none'
  }
};

export default NoticeDetails;