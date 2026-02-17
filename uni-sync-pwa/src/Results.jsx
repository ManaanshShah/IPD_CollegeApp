// src/Results.jsx
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from './api';

function Results() {
  const [marks, setMarks] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        // 1. Get User ID first
        const userRes = await api.get('/me');
        const userId = userRes.data.id;

        // 2. Fetch Marks using that ID
        const marksRes = await api.get(`/academic/marks/${userId}`);
        setMarks(marksRes.data.grades); // Backend returns { "IoT": 88, "DS": 91 }
      } catch (err) {
        console.error(err);
        setError('No results found or results not yet declared.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <button onClick={() => navigate('/dashboard')} style={styles.backBtn}>
          ← Back
        </button>
        <h2>📝 My Results</h2>
      </header>

      {loading && <p>Loading results...</p>}
      {error && <p style={{ color: '#666', marginTop: '20px' }}>{error}</p>}

      {!loading && !error && (
        <div style={styles.card}>
          <table style={styles.table}>
            <thead>
              <tr style={styles.headerRow}>
                <th style={{...styles.th, textAlign: 'left'}}>Subject</th>
                <th style={{...styles.th, textAlign: 'right'}}>Score</th>
                <th style={{...styles.th, textAlign: 'center'}}>Status</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(marks).map(([subject, score]) => (
                <tr key={subject} style={styles.row}>
                  <td style={styles.td}>{subject}</td>
                  <td style={{...styles.td, textAlign: 'right', fontWeight: 'bold'}}>
                    {score}/100
                  </td>
                  <td style={{...styles.td, textAlign: 'center'}}>
                    <span style={score >= 40 ? styles.pass : styles.fail}>
                      {score >= 40 ? 'PASS' : 'FAIL'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

const styles = {
  container: { padding: '20px', maxWidth: '600px', margin: '0 auto', textAlign: 'center' },
  header: { display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', marginBottom: '20px' },
  backBtn: { position: 'absolute', left: 0, padding: '8px 12px', cursor: 'pointer', background: 'transparent', border: '1px solid #ccc', borderRadius: '4px' },
  card: { background: 'white', padding: '20px', borderRadius: '10px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' },
  table: { width: '100%', borderCollapse: 'collapse' },
  headerRow: { borderBottom: '2px solid #f0f0f0' },
  th: { padding: '15px', color: '#555', fontSize: '14px', textTransform: 'uppercase' },
  row: { borderBottom: '1px solid #f0f0f0' },
  td: { padding: '15px', fontSize: '16px' },
  pass: { background: '#d4edda', color: '#155724', padding: '4px 8px', borderRadius: '4px', fontSize: '12px', fontWeight: 'bold' },
  fail: { background: '#f8d7da', color: '#721c24', padding: '4px 8px', borderRadius: '4px', fontSize: '12px', fontWeight: 'bold' }
};

export default Results;