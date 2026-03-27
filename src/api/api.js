import axios from 'axios';

// Create a central instance
const BASE_SERVER_URL = import.meta.env.VITE_API_URL || "http://localhost:8082";

const api = axios.create({
    baseURL: `${BASE_SERVER_URL}/api`,
    withCredentials: true // CRITICAL: This allows the JSESSIONID cookie to be sent
});

// Response Interceptors
api.interceptors.response.use(
  (response) => {
    console.log(`API Success [${response.config.method.toUpperCase()}] ${response.config.url}`, response.data);
    return response.data; // Automatically return the data part
  },
  (error) => {
    console.error(`API Error [${error.config?.method?.toUpperCase()}] ${error.config?.url}:`, error.response || error.message);
    if (error.response && (error.response.status === 401 || error.response.status === 403)) {
      if (window.location.pathname !== '/') {
        window.location.href = '/';
      }
    }
    return Promise.reject(error);
  }
);

// Notes & Folders
export const fetchMyFolders = () => api.get('/notes/folders');
export const createFolder = (name, isPublic) => 
    api.post(`/notes/folders/create?name=${encodeURIComponent(name)}&isPublic=${isPublic}`);
export const deleteFolder = (id) => api.delete(`/notes/folders/${id}`);
export const renameFolder = (id, newName) => 
    api.put(`/notes/folders/${id}?newName=${encodeURIComponent(newName)}`);
export const fetchPublicNotes = () => api.get('/notes/explore');
export const deleteNote = (id) => api.delete(`/notes/notes/${id}`);
export const fetchMyNotes = () => api.get('/notes/my-notes');
export const fetchCurrentUser = () => api.get('/notes/folders'); // Using folders as a proxy for 'logged in' check if no /me exists

export const logout = () => {
    // Standard Spring Security logout path
    window.location.href = `${BASE_SERVER_URL}/logout`;
};

// Upload
export const uploadNote = (formData) => api.post('/notes/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
});

// Events
export const fetchMyEvents = () => api.get('/events/my-events');
export const addCalendarEvent = (event) => api.post('/events/add', event);
export const deleteCalendarEvent = (id) => api.delete(`/events/delete/${id}`);

export default api;

