// API Configuration
const API_BASE_URL = process.env.REACT_APP_API_URL;

export const API_ENDPOINTS = {
  // Auth endpoints
  LOGIN: `${API_BASE_URL}/auth/login`,
  REGISTER: `${API_BASE_URL}/auth/register`,
  CONFIRM: `${API_BASE_URL}/auth/confirm`,
  REFRESH: `${API_BASE_URL}/auth/refresh`,
  
  // Todo endpoints
  TODOS: `${API_BASE_URL}/todos`,
  
  // Tags endpoints
  TAGS: `${API_BASE_URL}/tags`
};

export default API_BASE_URL;