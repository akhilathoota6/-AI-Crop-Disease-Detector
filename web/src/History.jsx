import { useEffect, useState } from 'react';
import API_URL from './api';
import { getToken } from './auth';

export default function History({ onBack }) {
  const [scans, setScans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    loadHistory();
  }, []);

  async function loadHistory() {
    try {
      const token = getToken();
      const response = await fetch(`${API_URL}/scan/history`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      if (!response.ok) {
        setErrorMsg(data.message || 'Could not load history');
        setLoading(false);
        return;
      }
      setScans(data);
    } catch (err) {
      setErrorMsg('Could not connect to server');
    }
    setLoading(false);
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h2 style={styles.headerTitle}>Scan history</h2>
        <span style={styles.backLink} onClick={onBack}>← Back to scan</span>
      </div>

      <div style={styles.content}>
        {loading && <p style={styles.muted}>Loading...</p>}
        {errorMsg && <p style={styles.error}>{errorMsg}</p>}
        {!loading && scans.length === 0 && !errorMsg && (
          <p style={styles.muted}>No scans yet. Go scan a leaf!</p>
        )}

        {scans.map((scan) => (
          <div key={scan._id} style={styles.scanCard}>
            <div style={styles.scanHeader}>
              <div>
                <p style={styles.scanCrop}>{scan.cropType}</p>
                <p style={styles.scanDisease}>{scan.diseaseName}</p>
              </div>
              <span style={styles.confidencePill}>{scan.confidence}</span>
            </div>
            <p style={styles.scanDate}>
              {new Date(scan.createdAt).toLocaleDateString(undefined, {
                year: 'numeric', month: 'short', day: 'numeric',
                hour: '2-digit', minute: '2-digit',
              })}
            </p>
            <p style={styles.scanTreatment}>{scan.treatment}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

const styles = {
  container: { minHeight: '100vh', backgroundColor: '#0a1a0f', fontFamily: 'system-ui, sans-serif' },
  header: {
    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
    padding: '20px 24px',
  },
  headerTitle: { color: '#fff', margin: 0, fontSize: 20 },
  backLink: { color: '#5DCAA5', fontSize: 13, cursor: 'pointer' },
  content: { maxWidth: 480, margin: '0 auto', padding: '0 24px 40px' },
  muted: { color: '#5a8a72', fontSize: 14, textAlign: 'center', marginTop: 40 },
  error: { color: '#F09595', fontSize: 13, textAlign: 'center', marginTop: 40 },
  scanCard: {
    backgroundColor: '#0d2218', borderRadius: 16, padding: 16, marginBottom: 12,
  },
  scanHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' },
  scanCrop: { color: '#5a8a72', fontSize: 12, margin: 0 },
  scanDisease: { color: '#5DCAA5', fontSize: 18, fontWeight: 700, margin: '2px 0 0' },
  confidencePill: {
    backgroundColor: '#1D9E75', color: '#fff', fontSize: 12, fontWeight: 700,
    borderRadius: 20, padding: '4px 10px', height: 'fit-content',
  },
  scanDate: { color: '#5a8a72', fontSize: 11, margin: '10px 0 6px' },
  scanTreatment: { color: '#fff', fontSize: 13, lineHeight: 1.5, margin: 0 },
};