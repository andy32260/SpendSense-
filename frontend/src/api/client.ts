import axios from 'axios';

const apiClient = axios.create({
  baseURL: 'http://127.0.0.1:8000/api/',
});

let currentAccessToken: string | null = null;

export function setApiToken(token: string | null) {
  currentAccessToken = token;
}

apiClient.interceptors.request.use((config) => {
  if (currentAccessToken) {
    config.headers.Authorization = `Bearer ${currentAccessToken}`;
  }
  return config;
});

export default apiClient;