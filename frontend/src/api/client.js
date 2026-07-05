import axios from 'axios';


// define the base URL 
const api = axios.create({
  baseURL: 'http://localhost:8080/api',
});


// Adding the token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});


// Error checking
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const requestUrl = error?.config?.url || '';

    // handling 401
    if (error?.response?.status === 401 && !requestUrl.includes('/auth/login') && !requestUrl.includes('/auth/register')) {
      localStorage.removeItem('token');
      localStorage.removeItem('username');
      localStorage.removeItem('doctorId');
      window.location.href = '/';
    }

    // redirect to home page
    return Promise.reject(error);
  }
);

export default api;


