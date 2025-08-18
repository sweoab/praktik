// API Configuration for connecting frontend to backend
export const API_CONFIG = {
  BASE_URL: 'http://localhost:3001/api',
  TIMEOUT: 10000,
};

// Enhanced fetcher functions with authentication
const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` })
  };
};

const getFetcher = async (url) => {
  try {
    const fullUrl = url.startsWith('http') ? url : `${API_CONFIG.BASE_URL}${url}`;
    const res = await fetch(fullUrl, {
      headers: getAuthHeaders(),
    });
    
    if (!res.ok) {
      if (res.status === 401) {
        // Token expired or invalid
        localStorage.removeItem('token');
        window.location.href = '/login';
        throw new Error('Authentication required');
      }
      const errorData = await res.text();
      throw new Error(`Failed to fetch data: ${res.status} ${res.statusText} - ${errorData}`);
    }
    return await res.json();
  } catch (error) {
    console.error('GET Fetch Error:', error);
    throw error;
  }
};

const postFetcher = async (url, arg) => {
  try {
    const fullUrl = url.startsWith('http') ? url : `${API_CONFIG.BASE_URL}${url}`;
    const res = await fetch(fullUrl, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(arg),
    });
    
    if (!res.ok) {
      if (res.status === 401) {
        localStorage.removeItem('token');
        window.location.href = '/login';
        throw new Error('Authentication required');
      }
      const errorData = await res.text();
      throw new Error(`Failed to post data: ${res.status} ${res.statusText} - ${errorData}`);
    }
    return await res.json();
  } catch (error) {
    console.error('POST Fetch Error:', error);
    throw error;
  }
};

const putFetcher = async (url, arg) => {
  try {
    const fullUrl = url.startsWith('http') ? url : `${API_CONFIG.BASE_URL}${url}`;
    const res = await fetch(fullUrl, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(arg),
    });
    
    if (!res.ok) {
      if (res.status === 401) {
        localStorage.removeItem('token');
        window.location.href = '/login';
        throw new Error('Authentication required');
      }
      const errorData = await res.text();
      throw new Error(`Failed to update data: ${res.status} ${res.statusText} - ${errorData}`);
    }
    return await res.json();
  } catch (error) {
    console.error('PUT Fetch Error:', error);
    throw error;
  }
};

const deleteFetcher = async (url, arg) => {
  try {
    const fullUrl = url.startsWith('http') ? url : `${API_CONFIG.BASE_URL}${url}`;
    const res = await fetch(fullUrl, {
      method: 'DELETE',
      headers: getAuthHeaders(),
      body: JSON.stringify(arg),
    });
    
    if (!res.ok) {
      if (res.status === 401) {
        localStorage.removeItem('token');
        window.location.href = '/login';
        throw new Error('Authentication required');
      }
      const errorData = await res.text();
      throw new Error(`Failed to delete data: ${res.status} ${res.statusText} - ${errorData}`);
    }
    return await res.json();
  } catch (error) {
    console.error('DELETE Fetch Error:', error);
    throw error;
  }
};

// Authentication helpers
export const authAPI = {
  login: (credentials) => postFetcher('/auth/login', credentials),
  register: (userData) => postFetcher('/auth/register', userData),
  logout: () => {
    localStorage.removeItem('token');
    window.location.href = '/login';
  },
  isAuthenticated: () => !!localStorage.getItem('token'),
  getToken: () => localStorage.getItem('token'),
  setToken: (token) => localStorage.setItem('token', token),
};

// API endpoints
export const API_ENDPOINTS = {
  // Auth
  LOGIN: '/auth/login',
  REGISTER: '/auth/register',
  
  // Blog
  BLOG_POSTS: '/blog/posts',
  BLOG_POST: (id) => `/blog/posts/${id}`,
  BLOG_COMMENTS: (postId) => `/blog/posts/${postId}/comments`,
  BLOG_VIEW: (postId) => `/blog/posts/${postId}/view`,
  
  // Contacts
  CONTACTS: '/contacts',
  CONTACT: (id) => `/contacts/${id}`,
  CONTACT_STARRED: (id) => `/contacts/${id}/starred`,
  
  // Users
  USERS: '/users',
  USER_PROFILE: (id) => `/users/profile/${id || ''}`,
};

export { getFetcher, postFetcher, putFetcher, deleteFetcher };
