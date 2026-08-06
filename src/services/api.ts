import axios from 'axios';
import toast from 'react-hot-toast';

// Create an Axios instance configured to communicate with the FastAPI backend
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000, // 15s timeout
});

// Request Interceptor: Attach JWT to every request if it exists
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

let isRefreshing = false;
let failedQueue: any[] = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

// Response Interceptor: Global Error Handling & 401 Redirects
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response && error.response.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise(function(resolve, reject) {
          failedQueue.push({resolve, reject})
        }).then(token => {
          originalRequest.headers['Authorization'] = 'Bearer ' + token;
          return api(originalRequest);
        }).catch(err => {
          return Promise.reject(err);
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      const refreshToken = localStorage.getItem('refresh_token');
      if (!refreshToken) {
         isRefreshing = false;
         localStorage.removeItem('access_token');
         localStorage.removeItem('user');
         window.location.href = '/login';
         return Promise.reject(error);
      }

      try {
         const { data } = await axios.post(`${import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api/v1'}/auth/refresh`, {
            refresh_token: refreshToken
         });
         
         const newAccessToken = data.access_token;
         const newRefreshToken = data.refresh_token;
         
         localStorage.setItem('access_token', newAccessToken);
         if (newRefreshToken) localStorage.setItem('refresh_token', newRefreshToken);
         
         api.defaults.headers.common['Authorization'] = `Bearer ${newAccessToken}`;
         originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
         
         processQueue(null, newAccessToken);
         return api(originalRequest);
      } catch (refreshError) {
         processQueue(refreshError, null);
         localStorage.removeItem('access_token');
         localStorage.removeItem('refresh_token');
         localStorage.removeItem('user');
         window.location.href = '/login';
         return Promise.reject(refreshError);
      } finally {
         isRefreshing = false;
      }
    }
    
    if (error.response) {
      const { status } = error.response;
      if (status === 403) {
        toast.error('You do not have permission to perform this action.');
      } else if (status >= 500) {
        toast.error('A server error occurred. Please try again later.');
      }
    } else if (error.request) {
      toast.error('Network error. Please check your connection.');
    }
    
    return Promise.reject(error);
  }
);

export default api;
