import React, { useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import LoginScreen from '../../components/LoginScreen';
import RegisterScreen from '../../components/RegisterScreen';
import ScanScreen from '../../components/ScanScreen';
import { getToken, getUser, logout } from '../../components/auth';

export default function Index() {
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [screen, setScreen] = useState<'login' | 'register'>('login');

  useEffect(() => {
    checkLogin();
  }, []);

  async function checkLogin() {
    const token = await getToken();
    const savedUser = await getUser();
    if (token && savedUser) {
      setUser(savedUser);
    }
    setCheckingAuth(false);
  }

  async function handleLogout() {
    await logout();
    setUser(null);
  }

  if (checkingAuth) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator color="#1D9E75" size="large" />
      </View>
    );
  }

  if (user) {
    return <ScanScreen user={user} onLogout={handleLogout} />;
  }

  if (screen === 'login') {
    return (
      <LoginScreen
        onLoginSuccess={(u: any) => setUser(u)}
        onGoToRegister={() => setScreen('register')}
      />
    );
  }

  return (
    <RegisterScreen
      onRegisterSuccess={(u: any) => setUser(u)}
      onGoToLogin={() => setScreen('login')}
    />
  );
}

const styles = StyleSheet.create({
  loading: {
    flex: 1,
    backgroundColor: '#0a1a0f',
    alignItems: 'center',
    justifyContent: 'center',
  },
});