import axios from 'axios';
import { clearAuthToken } from '../utils/tokenUtils';

// Create an Axios instance with default configuration
const axiosInstance = axios.create({
  baseURL: 'http://localhost:8000/api/v1',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  timeout: 15000, // 15 seconds - increased for slower connections
  withCredentials: false // Set to true if your API requires cookies/credentials
});

// Add a request interceptor to include the token in the headers if available
axiosInstance.interceptors.request.use(
  (config) => {
    // Ensure headers object exists
    config.headers = config.headers || {};

    // Always include these headers
    config.headers['Content-Type'] = 'application/json';
    config.headers['Accept'] = 'application/json';

    // Add authorization token if available
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Log the request for debugging
    console.log(`Request to ${config.url}:`, {
      method: config.method,
      headers: config.headers,
      data: config.data
    });

    return config;
  },
  (error) => {
    console.error('Request interceptor error:', error);
    return Promise.reject(error);
  }
);

// Add a response interceptor to handle common errors
axiosInstance.interceptors.response.use(
  (response) => {
    // Log successful responses for debugging
    console.log(`Response from ${response.config.url}:`, {
      status: response.status,
      data: response.data,
      headers: response.headers
    });
    return response;
  },
  (error) => {
    // Log error responses for debugging
    console.error('Response error:', error);

    if (error.response) {
      console.error(`Error response from ${error.config?.url}:`, {
        status: error.response.status,
        data: error.response.data,
        headers: error.response.headers
      });

      // Handle specific error cases here
      if (error.response.status === 401) {
        // Unauthorized - clear token and redirect to login
        clearAuthToken();

        // Show message about session expiration
        alert('Your session has expired. Please log in again.');

        // Redirect to login page
        window.location.href = '/login';
      }
    } else if (error.request) {
      console.error('No response received:', error.request);
    } else {
      console.error('Error message:', error.message);
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
