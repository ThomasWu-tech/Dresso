const API_URL = 'http://localhost:8000';

const api = {
  signup: async (username, email, password) => {
    const response = await fetch(`${API_URL}/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, email, password }),
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || 'Signup failed');
    }
    return response.json();
  },

  login: async (username, password) => {
    const formData = new URLSearchParams();
    formData.append('username', username);
    formData.append('password', password);

    const response = await fetch(`${API_URL}/token`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: formData,
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || 'Login failed');
    }
    return response.json();
  },

  getMe: async (token) => {
    const response = await fetch(`${API_URL}/users/me`, {
      headers: { 'Authorization': `Bearer ${token}` },
    });
    if (!response.ok) throw new Error('Failed to fetch user');
    return response.json();
  },

  updateProfile: async (token, data) => {
    const response = await fetch(`${API_URL}/users/me`, {
      method: 'PUT',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}` 
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || 'Update failed');
    }
    return response.json();
  },

  uploadAvatar: async (token, file) => {
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch(`${API_URL}/users/me/avatar`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${token}` },
      body: formData,
    });
    if (!response.ok) throw new Error('Avatar upload failed');
    return response.json();
  },

  uploadClothing: async (token, file) => {
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch(`${API_URL}/upload-clothing`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${token}` },
      body: formData,
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || 'Upload failed');
    }
    return response.json();
  },

  getClothingItems: async () => {
    const response = await fetch(`${API_URL}/clothing-items`);
    if (!response.ok) throw new Error('Failed to fetch clothing items');
    return response.json();
  }
};

window.api = api;
