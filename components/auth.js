import * as SecureStore from 'expo-secure-store';

export async function saveToken(token) {
  await SecureStore.setItemAsync('userToken', token);
}

export async function getToken() {
  return await SecureStore.getItemAsync('userToken');
}

export async function saveUser(user) {
  await SecureStore.setItemAsync('userData', JSON.stringify(user));
}

export async function getUser() {
  const data = await SecureStore.getItemAsync('userData');
  return data ? JSON.parse(data) : null;
}

export async function logout() {
  await SecureStore.deleteItemAsync('userToken');
  await SecureStore.deleteItemAsync('userData');
}