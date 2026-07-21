export function saveToken(token) {
  localStorage.setItem('userToken', token);
}

export function getToken() {
  return localStorage.getItem('userToken');
}

export function saveUser(user) {
  localStorage.setItem('userData', JSON.stringify(user));
}

export function getUser() {
  const data = localStorage.getItem('userData');
  return data ? JSON.parse(data) : null;
}

export function logout() {
  localStorage.removeItem('userToken');
  localStorage.removeItem('userData');
}