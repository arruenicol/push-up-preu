// frontend/src/services/api.js
import axios from 'axios';

const API_URL = 'https://push-up-backend.onrender.com';

// Instancia de Axios con configuración por defecto
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para añadir token de autenticación
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor para manejar respuestas
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Si el error es 401 y no hemos intentado refrescar el token
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const refreshToken = localStorage.getItem('refreshToken');
        if (refreshToken) {
          const response = await axios.post(`${API_URL}/token/refresh/`, {
            refresh: refreshToken,
          });
          
          const { access } = response.data;
          localStorage.setItem('token', access);
          
          // Reintento con nuevo token
          originalRequest.headers.Authorization = `Bearer ${access}`;
          return axios(originalRequest);
        }
      } catch (err) {
        // Error refrescando el token, deslogueamos al usuario
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
        window.location.href = '/login';
      }
    }
    
    return Promise.reject(error);
  }
);

// Servicio de autenticación
export const authService = {
  login: async (email, password) => {
    const response = await api.post('/token/', {
      email,
      password
    });
    
    const { access, refresh } = response.data;
    localStorage.setItem('token', access);
    localStorage.setItem('refreshToken', refresh);
    console.log(localStorage.getItem('token'));
    
    return response.data;
  },
  
  register: async (userData) => {
    return api.post('/users/', userData);
  },
  
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
  },
  
  getCurrentUser: async () => {
    return api.get('/users/me/');
  },
};

// Servicio de cursos
export const courseService = {
  getAllCourses: () => {
    return api.get('/courses/');
  },
  
  getCourse: (id) => {
    return api.get(`/courses/${id}/`);
  },
  
  getMyGroups: () => {
    return api.get('/groups/my_groups/');
  },
  
  getGroupDetail: (id) => {
    return api.get(`/groups/${id}/`);
  },
};

// Servicio de notificaciones
export const notificationService = {
  getMyNotifications: () => {
    return api.get('/notifications/my_notifications/');
  },
  
  getNotification: (id) => {
    return api.get(`/notifications/${id}/`);
  },
  
  registerPushToken: (token) => {
    return api.post('/users/register_push_token/', { push_token: token });
  },
};

export default api;
