import axios from 'axios';

const API_URL = 'http://localhost:3000';

const api = axios.create({
  baseURL: API_URL,
});

export const setAuthToken = (token) => {
  api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
};

export default api;
