import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000/api';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  // Add timeout
  timeout: 10000,
  // Enable request caching
  cache: {
    maxAge: 15 * 60 * 1000, // 15 minutes
  },
});

// Request interceptor with caching
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // Add cache control headers
    if (config.method === 'get') {
      config.headers['Cache-Control'] = 'public, max-age=300'; // 5 minutes
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor with error handling and caching
api.interceptors.response.use(
  (response) => {
    // Cache successful GET requests
    if (response.config.method === 'get') {
      const cacheKey = response.config.url;
      sessionStorage.setItem(cacheKey, JSON.stringify({
        data: response.data,
        timestamp: Date.now(),
      }));
    }
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth APIs with caching
export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  signup: (userData) => api.post('/auth/signup', userData),
  logout: () => {
    localStorage.removeItem('token');
    return api.post('/auth/logout');
  },
};

// Car APIs with caching
export const carAPI = {
  getAllCars: async () => {
    const cacheKey = '/cars';
    const cached = sessionStorage.getItem(cacheKey);
    
    if (cached) {
      const { data, timestamp } = JSON.parse(cached);
      if (Date.now() - timestamp < 5 * 60 * 1000) { // 5 minutes cache
        return { data };
      }
    }
    
    return api.get('/cars');
  },
  getCarById: async (id) => {
    const cacheKey = `/cars/${id}`;
    const cached = sessionStorage.getItem(cacheKey);
    
    if (cached) {
      const { data, timestamp } = JSON.parse(cached);
      if (Date.now() - timestamp < 5 * 60 * 1000) {
        return { data };
      }
    }
    
    return api.get(`/cars/${id}`);
  },
  createCar: (carData) => api.post('/cars', carData),
  updateCar: (id, carData) => api.put(`/cars/${id}`, carData),
  deleteCar: (id) => api.delete(`/cars/${id}`),
};

// Support APIs with caching
export const supportAPI = {
  createTicket: (ticketData) => api.post('/support/tickets', ticketData),
  getTickets: async () => {
    const cacheKey = '/support/tickets';
    const cached = sessionStorage.getItem(cacheKey);
    
    if (cached) {
      const { data, timestamp } = JSON.parse(cached);
      if (Date.now() - timestamp < 5 * 60 * 1000) {
        return { data };
      }
    }
    
    return api.get('/support/tickets');
  },
  getTicketById: async (id) => {
    const cacheKey = `/support/tickets/${id}`;
    const cached = sessionStorage.getItem(cacheKey);
    
    if (cached) {
      const { data, timestamp } = JSON.parse(cached);
      if (Date.now() - timestamp < 5 * 60 * 1000) {
        return { data };
      }
    }
    
    return api.get(`/support/tickets/${id}`);
  },
};

export default api; 