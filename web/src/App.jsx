import { useEffect, useState } from 'react';
import Login from './Login';
import Register from './Register';
import Scan from './Scan';
import { getToken, getUser, logout } from './auth';

export default function App() {
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [user, setUser] = useState(null);
  const [screen, setScreen] = useState('login');

  useEffect(() => {
    const token = getToken();
    const savedUser = getUser();
    if (token && savedUser) {
      setUser(savedUser);
    }
    setCheckingAuth(false);
  }, []);

  function handleLogout() {
    logout();
    setUser(null);
  }

  if (checkingAuth) {
    return <div style={{ minHeight: '100vh', backgroundColor: '#0a1a0f' }} />;
  }

  if (user) {
    return <Scan user={user} onLogout={handleLogout} />;
  }

  if (screen === 'login') {
    return (
      <Login
        onLoginSuccess={(u) => setUser(u)}
        onGoToRegister={() => setScreen('register')}
      />
    );
  }

  return (
    <Register
      onRegisterSuccess={(u) => setUser(u)}
      onGoToLogin={() => setScreen('login')}
    />
  );
}
