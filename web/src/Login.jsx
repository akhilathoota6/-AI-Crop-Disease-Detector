import { useState } from 'react';
import API_URL from './api';
import { saveToken, saveUser } from './auth';

export default function Login({ onLoginSuccess, onGoToRegister }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleLogin(e) {
    e.preventDefault();
    if (!email || !password) {
      setError('Please enter email and password');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();

      if (!response.ok) {
        setError(data.message || 'Login failed');
        setLoading(false);
        return;
      }

      saveToken(data.token);
      saveUser(data.user);
      setLoading(false);
      onLoginSuccess(data.user);
    } catch (err) {
      setError('Could not connect to server');
      setLoading(false);
    }
  }

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={styles.emoji}>🌶️</div>
        <h1 style={styles.title}>ChilliTrack</h1>
        <p style={styles.subtitle}>AI Crop Disease Detector</p>

        <form onSubmit={handleLogin} style={styles.form}>
          <label style={styles.label}>Email</label>
          <input
            style={styles.input}
            type="email"
            placeholder="your@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <label style={styles.label}>Password</label>
          <input
            style={styles.input}
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          {error && <p style={styles.error}>{error}</p>}

          <button style={styles.button} type="submit" disabled={loading}>
            {loading ? 'Logging in...' : 'Log in'}
          </button>

          <p style={styles.link} onClick={onGoToRegister}>
            New farmer? Create an account
          </p>
        </form>
      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: '100vh',
    backgroundColor: '#0a1a0f',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontFamily: 'system-ui, sans-serif',
  },
  card: { width: '100%', maxWidth: 380, padding: 24, textAlign: 'center' },
  emoji: { fontSize: 48, marginBottom: 8 },
  title: { color: '#fff', fontSize: 28, fontWeight: 700, margin: 0 },
  subtitle: { color: '#9FE1CB', fontSize: 13, marginBottom: 32 },
  form: { textAlign: 'left' },
  label: { color: '#9FE1CB', fontSize: 13, display: 'block', marginBottom: 6, marginTop: 14 },
  input: {
    width: '100%',
    backgroundColor: '#0d2218',
    borderRadius: 12,
    padding: 14,
    color: '#fff',
    fontSize: 15,
    border: '1px solid #1a3a28',
    boxSizing: 'border-box',
  },
  error: { color: '#F09595', fontSize: 13, marginTop: 12, textAlign: 'center' },
  button: {
    width: '100%',
    backgroundColor: '#1D9E75',
    color: '#fff',
    padding: 16,
    borderRadius: 14,
    border: 'none',
    fontSize: 16,
    fontWeight: 600,
    marginTop: 24,
    cursor: 'pointer',
  },
  link: { color: '#5DCAA5', fontSize: 13, textAlign: 'center', marginTop: 18, cursor: 'pointer' },
};