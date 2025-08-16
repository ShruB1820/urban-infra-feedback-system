import axios from 'axios';

const API = axios.create({
  baseURL: 'http://43.220.4.240/api', // use EC2 public IP or domain
});

export const setAuthToken = token => {
  if (token) API.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  else delete API.defaults.headers.common['Authorization'];
};

export default API;