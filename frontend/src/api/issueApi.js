import API from '../axiosConfig';

export const getIssues = (params) => API.get('/issues', { params });
export const getIssue = (id) => API.get(`/issues/${id}`);
export const createIssue = (formData) => API.post('/issues', formData);
export const updateIssue = (id, formData) => API.put(`/issues/${id}`, formData);
export const deleteIssue = (id) => API.delete(`/issues/${id}`);
export const updateStatus = (id, status) => API.patch(`/issues/${id}/status`, { status });
export const getAllIssues = () => API.get('/issues/all'); // New endpoint for fetching all issues