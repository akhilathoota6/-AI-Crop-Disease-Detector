import { CameraView, useCameraPermissions } from 'expo-camera';
import React, { useRef, useState } from 'react';
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import API_URL from './api';
import { getToken } from './auth';

export default function ScanScreen({ user, onLogout }: any) {
  const [permission, requestPermission] = useCameraPermissions();
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const cameraRef = useRef<any>(null);

  if (!permission) return <View style={styles.container} />;
  if (!permission.granted) {
    return (
      <View style={styles.permissionContainer}>
        <Text style={styles.emoji}>🌶️</Text>
        <Text style={styles.permissionTitle}>Camera access needed</Text>
        <Text style={styles.permissionText}>
          Point your camera at a crop leaf to detect diseases instantly
        </Text>
        <TouchableOpacity style={styles.allowButton} onPress={requestPermission}>
          <Text style={styles.allowButtonText}>Allow camera</Text>
        </TouchableOpacity>
      </View>
    );
  }

  async function scanLeaf() {
    if (!cameraRef.current) return;
    setLoading(true);
    setResult(null);
    setErrorMsg('');
    try {
      const photo = await cameraRef.current.takePictureAsync({ quality: 0.6 });
      const token = await getToken();

      const formData = new FormData();
      formData.append('image', {
        uri: photo.uri,
        type: 'image/jpeg',
        name: 'leaf.jpg',
      } as any);

      const response = await fetch(`${API_URL}/scan/analyse`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        setErrorMsg(data.message || 'Something went wrong');
        setLoading(false);
        return;
      }

      if (data.isLeaf === false) {
        setErrorMsg(data.message || 'No plant leaf detected. Please scan a crop leaf.');
        setLoading(false);
        return;
      }

      setResult(data);
    } catch (e) {
      setErrorMsg('Could not connect to server. Check your connection.');
    }
    setLoading(false);
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>ChilliTrack 🌶️</Text>
          {user?.name ? <Text style={styles.headerSub}>Hi, {user.name}</Text> : null}
        </View>
        <TouchableOpacity onPress={onLogout}>
          <Text style={styles.logoutText}>Log out</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.cameraContainer}>
        <CameraView style={styles.camera} ref={cameraRef} />
        <View style={styles.cornerTL} />
        <View style={styles.cornerTR} />
        <View style={styles.cornerBL} />
        <View style={styles.cornerBR} />
        <Text style={styles.cameraHint}>Align leaf within frame</Text>
      </View>

      <TouchableOpacity
        style={[styles.scanButton, loading && styles.scanButtonDisabled]}
        onPress={scanLeaf}
        disabled={loading}
      >
        {loading ? (
          <View style={styles.loadingRow}>
            <ActivityIndicator color="#fff" size="small" />
            <Text style={styles.scanButtonText}>  Analysing leaf...</Text>
          </View>
        ) : (
          <Text style={styles.scanButtonText}>📷  Scan leaf</Text>
        )}
      </TouchableOpacity>

      {errorMsg ? (
        <View style={styles.errorCard}>
          <Text style={styles.errorText}>{errorMsg}</Text>
        </View>
      ) : null}

      {!result && !loading && !errorMsg && (
        <View style={styles.tipsCard}>
          <Text style={styles.tipsTitle}>How to scan</Text>
          <Text style={styles.tipItem}>① Hold leaf 15–20cm from camera</Text>
          <Text style={styles.tipItem}>② Ensure good natural lighting</Text>
          <Text style={styles.tipItem}>③ Tap scan leaf — results in a few seconds</Text>
        </View>
      )}

      {result && (
        <View style={styles.resultCard}>
          <View style={styles.resultHeader}>
            <View style={styles.resultTitleGroup}>
              <Text style={styles.resultCrop}>{result.cropType}</Text>
              <Text style={styles.resultDisease}>{result.diseaseName}</Text>
            </View>
            <View style={styles.confidencePill}>
              <Text style={styles.confidenceText}>{result.confidence}</Text>
            </View>
          </View>

          <Text style={styles.treatmentLabel}>DESCRIPTION</Text>
          <Text style={styles.treatmentText}>{result.description}</Text>

          <Text style={styles.treatmentLabel}>TREATMENT</Text>
          <Text style={styles.treatmentText}>{result.treatment}</Text>

          <Text style={styles.treatmentLabel}>ORGANIC OPTION</Text>
          <Text style={styles.treatmentText}>{result.organicTreatment}</Text>

          <Text style={styles.treatmentLabel}>PREVENTION</Text>
          <Text style={styles.treatmentText}>{result.prevention}</Text>

          <TouchableOpacity
            style={styles.scanAgainButton}
            onPress={() => {
              setResult(null);
              setErrorMsg('');
            }}
          >
            <Text style={styles.scanAgainText}>Scan another leaf</Text>
          </TouchableOpacity>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0a1a0f' },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    paddingTop: 50,
  },
  headerTitle: { fontSize: 20, fontWeight: '700', color: '#fff' },
  headerSub: { fontSize: 12, color: '#9FE1CB', marginTop: 2 },
  logoutText: { color: '#5DCAA5', fontSize: 13 },
  cameraContainer: {
    margin: 16,
    borderRadius: 16,
    overflow: 'hidden',
    position: 'relative',
    height: 260,
  },
  camera: { flex: 1 },
  cornerTL: {
    position: 'absolute',
    top: 12,
    left: 12,
    width: 24,
    height: 24,
    borderTopWidth: 3,
    borderLeftWidth: 3,
    borderColor: '#1D9E75',
    borderTopLeftRadius: 4,
  },
  cornerTR: {
    position: 'absolute',
    top: 12,
    right: 12,
    width: 24,
    height: 24,
    borderTopWidth: 3,
    borderRightWidth: 3,
    borderColor: '#1D9E75',
    borderTopRightRadius: 4,
  },
  cornerBL: {
    position: 'absolute',
    bottom: 32,
    left: 12,
    width: 24,
    height: 24,
    borderBottomWidth: 3,
    borderLeftWidth: 3,
    borderColor: '#1D9E75',
    borderBottomLeftRadius: 4,
  },
  cornerBR: {
    position: 'absolute',
    bottom: 32,
    right: 12,
    width: 24,
    height: 24,
    borderBottomWidth: 3,
    borderRightWidth: 3,
    borderColor: '#1D9E75',
    borderBottomRightRadius: 4,
  },
  cameraHint: {
    position: 'absolute',
    bottom: 10,
    alignSelf: 'center',
    color: '#9FE1CB',
    fontSize: 12,
  },
  scanButton: {
    backgroundColor: '#1D9E75',
    marginHorizontal: 16,
    padding: 16,
    borderRadius: 14,
    alignItems: 'center',
  },
  scanButtonDisabled: { backgroundColor: '#0d3d2a' },
  scanButtonText: { color: '#fff', fontSize: 17, fontWeight: '600' },
  loadingRow: { flexDirection: 'row', alignItems: 'center' },
  errorCard: {
    margin: 16,
    backgroundColor: '#2a1414',
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: '#4a1b1b',
  },
  errorText: { color: '#F09595', fontSize: 13, textAlign: 'center' },
  tipsCard: {
    margin: 16,
    backgroundColor: '#0d2218',
    borderRadius: 12,
    padding: 14,
  },
  tipsTitle: { color: '#5DCAA5', fontSize: 13, fontWeight: '600', marginBottom: 8 },
  tipItem: { color: '#9FE1CB', fontSize: 13, marginBottom: 5, lineHeight: 20 },
  resultCard: {
    margin: 16,
    backgroundColor: '#0d2218',
    borderRadius: 16,
    padding: 16,
  },
  resultHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 14,
  },
  resultTitleGroup: { flex: 1 },
  resultCrop: { color: '#5a8a72', fontSize: 12, marginBottom: 2 },
  resultDisease: { color: '#5DCAA5', fontSize: 20, fontWeight: '700' },
  confidencePill: {
    backgroundColor: '#1D9E75',
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  confidenceText: { color: '#fff', fontSize: 12, fontWeight: '700' },
  treatmentLabel: {
    color: '#5a8a72',
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 0.5,
    marginTop: 12,
    marginBottom: 6,
  },
  treatmentText: { color: '#fff', fontSize: 14, lineHeight: 22 },
  scanAgainButton: {
    borderWidth: 1,
    borderColor: '#1D9E75',
    borderRadius: 10,
    padding: 12,
    alignItems: 'center',
    marginTop: 20,
  },
  scanAgainText: { color: '#1D9E75', fontSize: 14, fontWeight: '600' },
  permissionContainer: {
    flex: 1,
    backgroundColor: '#0a1a0f',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 30,
  },
  emoji: { fontSize: 60, marginBottom: 16 },
  permissionTitle: { color: '#fff', fontSize: 22, fontWeight: '700', marginBottom: 10 },
  permissionText: {
    color: '#9FE1CB',
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 30,
  },
  allowButton: {
    backgroundColor: '#1D9E75',
    paddingHorizontal: 32,
    paddingVertical: 14,
    borderRadius: 14,
  },
  allowButtonText: { color: '#fff', fontSize: 16, fontWeight: '600' },
});