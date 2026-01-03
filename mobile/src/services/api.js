import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8080' // A porta do Spring Boot
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  
  // Só adiciona o token se ele existir E se não for uma rota de login ou for uma rota
  if (token && !config.url.includes('/auth') && !config.url.includes('/create')) {
     config.headers.Authorization = `Bearer ${token}`;
  }
  
  // Na verdade, o ideal é deixar como você fez, pois se o token existir, 
  // ele deve ser enviado para identificar o usuário se necessário.
  return config;
});
export default api;