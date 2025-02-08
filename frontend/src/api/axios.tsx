import axios from 'axios';

// Create an axios instance with a base URL and default configuration
const api = axios.create({
  baseURL: '/api', // Use the proxy prefix for development
  withCredentials: true, // Include cookies for session handling
});

export default api;