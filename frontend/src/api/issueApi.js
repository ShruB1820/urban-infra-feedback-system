import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:5001/api',
});

export const setAuthToken = token => {
  if (token) API.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  else delete API.defaults.headers.common['Authorization'];
};

// Issues
export const getIssues = (params) => API.get('/issues', { params });
export const getIssue = (id) => API.get(`/issues/${id}`);
export const createIssue = (formData) => API.post('/issues', formData);
export const updateIssue = (id, formData) => API.put(`/issues/${id}`, formData);
export const deleteIssue = (id) => API.delete(`/issues/${id}`);
export const updateStatus = (id, status) => API.patch(`/issues/${id}/status`, { status });