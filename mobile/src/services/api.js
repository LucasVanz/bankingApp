import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8080' // A porta do Spring Boot
});

export default api;