import axios from 'axios';

// Vite proxy forwards /api to Rails backend at http://localhost:3000
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to attach Bearer token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for unified error extraction & 401 handling
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Clear token if invalid/expired session
      const currentPath = window.location.pathname;
      if (currentPath !== '/login' && currentPath !== '/signup') {
        localStorage.removeItem('auth_token');
        localStorage.removeItem('auth_user');
      }
    }
    return Promise.reject(error);
  }
);

export const authApi = {
  login: async (email, password) => {
    const response = await apiClient.post('/api/v1/sign_in', { email, password });
    return response.data;
  },
  signUp: async ({ organization_name, email, password, password_confirmation, role = 'admin' }) => {
    const response = await apiClient.post('/api/v1/sign_up', {
      organization_name,
      email,
      password,
      password_confirmation,
      role,
    });
    return response.data;
  },
  logout: async () => {
    try {
      await apiClient.delete('/api/v1/sign_out');
    } catch {
      // Ignore network errors on logout
    } finally {
      localStorage.removeItem('auth_token');
      localStorage.removeItem('auth_user');
    }
  },
  getMe: async () => {
    const response = await apiClient.get('/api/v1/me');
    return response.data;
  },
};

export const organizationApi = {
  validate: async (name) => {
    const response = await apiClient.get('/api/v1/organizations/validate', {
      params: { name },
    });
    return response.data;
  },
};

export const analyticsApi = {
  getSummary: async () => {
    const response = await apiClient.get('/api/v1/analytics');
    return response.data;
  },
};

export const employeesApi = {
  list: async (params = {}) => {
    const response = await apiClient.get('/api/v1/employees', { params });
    return response.data;
  },
  get: async (id) => {
    const response = await apiClient.get(`/api/v1/employees/${id}`);
    return response.data;
  },
  create: async (data) => {
    const response = await apiClient.post('/api/v1/employees', data);
    return response.data;
  },
  update: async (id, data) => {
    const response = await apiClient.put(`/api/v1/employees/${id}`, data);
    return response.data;
  },
  delete: async (id) => {
    const response = await apiClient.delete(`/api/v1/employees/${id}`);
    return response.data;
  },
  import: async (file, onUploadProgress) => {
    const formData = new FormData();
    formData.append('file', file);
    const response = await apiClient.post('/api/v1/employees/import', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress,
    });
    return response.data;
  },
};

export const usersApi = {
  list: async () => {
    const response = await apiClient.get('/api/v1/users');
    return response.data;
  },
  create: async (data) => {
    const response = await apiClient.post('/api/v1/users', data);
    return response.data;
  },
};

