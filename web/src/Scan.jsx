import { useState } from 'react';
import API_URL from './api';
import { getToken } from './auth';

export default function Scan({ user, onLogout }) {
  const [preview, setPreview] = useState(null);
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');

  function handleFileSelect(e) {
    const selected = e.target.files[0];
    if (!selected) return;
    setFile(selected);
    setPreview(URL.createObjectURL(selected));
    setResult(null);
    setErrorMsg('');
  }

  async function handleScan() {
    if (!file) {
      setErrorMsg('Please choose a leaf photo first');
      return;
    }
    setLoading(true);
    setErrorMsg('');
    setResult(null);
    try {
      const token = getToken();
      const formData = new FormData();
      formData.append('image', file);

      const response = await fetch(`${API_URL}/scan/analyse`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        setErrorMsg(data.message || 'Something went wrong');
        setLoading(false);
        return;
      }

      if (data.isLeaf === false) {
        setErrorMsg(data.message || 'No plant leaf detected. Please upload a crop leaf photo.');
        setLoading(false);
        return;
      }

      setResult(data);
    } catch (err) {
      setErrorMsg('Could not connect to server');
    }
    setLoading(false);
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <div>
          <h2 style={styles.headerTitle}>ChilliTrack 🌶️</h2>
          {user?.name && <p style={styles.headerSub}>Hi, {user.name}</p>}
        </div>
        <span style={styles.logout} onClick={onLogout}>Log out</span>
      </div>

      <div style={styles.content}>
        <div style={styles.uploadCard}>
          {preview ? (
            <img src={preview} alt="preview" style={styles.previewImg} />
          ) : (
            <div style={styles.placeholder}>No image selected</div>
          )}
          <input type="file" accept="image/*" onChange={handleFileSelect} style={styles.fileInput} />
        </div>

        <button style={styles.scanButton} onClick={handleScan} disabled={loading}>
          {loading ? 'Analysing leaf...' : '📷 Scan leaf'}
        </button>

        {errorMsg && <div style={styles.errorCard}>{errorMsg}</div>}

        {result && (
          <div style={styles.resultCard}>
            <div style={styles.resultHeader}>
              <div>
                <p style={styles.resultCrop}>{result.cropType}</p>
                <p style={styles.resultDisease}>{result.diseaseName}</p>
              </div>
              <span style={styles.confidencePill}>{result.confidence}</span>
            </div>

            <p style={styles.label}>DESCRIPTION</p>
            <p style={styles.text}>{result.description}</p>

            <p style={styles.label}>TREATMENT</p>
            <p style={styles.text}>{result.treatment}</p>

            <p style={styles.label}>ORGANIC OPTION</p>
            <p style={styles.text}>{result.organicTreatment}</p>

            <p style={styles.label}>PREVENTION</p>
            <p style={styles.text}>{result.prevention}</p>
          </div>
        )}
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
  headerSub: { color: '#9FE1CB', fontSize: 12, margin: '4px 0 0' },
  logout: { color: '#5DCAA5', fontSize: 13, cursor: 'pointer' },
  content: { maxWidth: 480, margin: '0 auto', padding: '0 24px 40px' },
  uploadCard: {
    backgroundColor: '#0d2218', borderRadius: 16, padding: 20,
    textAlign: 'center', marginBottom: 16,
  },
  previewImg: { width: '100%', maxHeight: 280, objectFit: 'cover', borderRadius: 12, marginBottom: 12 },
  placeholder: {
    height: 180, display: 'flex', alignItems: 'center', justifyContent: 'center',
    color: '#5a8a72', border: '1px dashed #1a3a28', borderRadius: 12, marginBottom: 12,
  },
  fileInput: { color: '#9FE1CB', width: '100%' },
  scanButton: {
    width: '100%', backgroundColor: '#1D9E75', color: '#fff', padding: 16,
    borderRadius: 14, border: 'none', fontSize: 16, fontWeight: 600, cursor: 'pointer',
  },
  errorCard: {
    marginTop: 16, backgroundColor: '#2a1414', border: '1px solid #4a1b1b',
    borderRadius: 12, padding: 14, color: '#F09595', fontSize: 13, textAlign: 'center',
  },
  resultCard: { marginTop: 16, backgroundColor: '#0d2218', borderRadius: 16, padding: 20 },
  resultHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 14 },
  resultCrop: { color: '#5a8a72', fontSize: 12, margin: 0 },
  resultDisease: { color: '#5DCAA5', fontSize: 20, fontWeight: 700, margin: '2px 0 0' },
  confidencePill: {
    backgroundColor: '#1D9E75', color: '#fff', fontSize: 12, fontWeight: 700,
    borderRadius: 20, padding: '4px 10px', height: 'fit-content',
  },
  label: { color: '#5a8a72', fontSize: 11, fontWeight: 600, letterSpacing: 0.5, marginTop: 12, marginBottom: 6 },
  text: { color: '#fff', fontSize: 14, lineHeight: 1.6, margin: 0 },
};