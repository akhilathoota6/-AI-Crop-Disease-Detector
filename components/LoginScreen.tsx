import React, { useState } from 'react';
import {
    ActivityIndicator,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import API_URL from './api';
import { saveToken, saveUser } from './auth';

export default function LoginScreen({ onLoginSuccess, onGoToRegister }: any) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleLogin() {
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

      await saveToken(data.token);
      await saveUser(data.user);
      setLoading(false);
      onLoginSuccess(data.user);
    } catch (e) {
      setError('Could not connect to server');
      setLoading(false);
    }
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.emoji}>🌶️</Text>
      <Text style={styles.title}>ChilliTrack</Text>
      <Text style={styles.subtitle}>AI Crop Disease Detector</Text>

      <View style={styles.form}>
        <Text style={styles.label}>Email</Text>
        <TextInput
          style={styles.input}
          placeholder="your@email.com"
          placeholderTextColor="#5a8a72"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
        />

        <Text style={styles.label}>Password</Text>
        <TextInput
          style={styles.input}
          placeholder="••••••••"
          placeholderTextColor="#5a8a72"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />

        {error ? <Text style={styles.error}>{error}</Text> : null}

        <TouchableOpacity style={styles.button} onPress={handleLogin} disabled={loading}>
          {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Log in</Text>}
        </TouchableOpacity>

        <TouchableOpacity onPress={onGoToRegister} style={styles.linkRow}>
          <Text style={styles.linkText}>New farmer? Create an account</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0a1a0f' },
  content: { flexGrow: 1, alignItems: 'center', justifyContent: 'center', padding: 24 },
  emoji: { fontSize: 48, marginBottom: 8 },
  title: { fontSize: 26, fontWeight: '700', color: '#fff', marginBottom: 4 },
  subtitle: { fontSize: 13, color: '#9FE1CB', marginBottom: 32 },
  form: { width: '100%' },
  label: { color: '#9FE1CB', fontSize: 13, marginBottom: 6, marginTop: 14 },
  input: {
    backgroundColor: '#0d2218',
    borderRadius: 12,
    padding: 14,
    color: '#fff',
    fontSize: 15,
    borderWidth: 1,
    borderColor: '#1a3a28',
  },
  error: { color: '#F09595', fontSize: 13, marginTop: 12, textAlign: 'center' },
  button: {
    backgroundColor: '#1D9E75',
    padding: 16,
    borderRadius: 14,
    alignItems: 'center',
    marginTop: 24,
  },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: '600' },
  linkRow: { marginTop: 18, alignItems: 'center' },
  linkText: { color: '#5DCAA5', fontSize: 13 },
});