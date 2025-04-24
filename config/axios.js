import axios from 'axios';

const clienteAxios = axios.create({
  baseURL: 'https://migpics-backend.onrender.com/api', // 👈 Agrega /api
  withCredentials: true, // 👈 Fundamental para cookies
  timeout: 10000, // 10 segundos máximo por solicitud
  headers: {
    'Content-Type': 'application/json',
    'X-Requested-With': 'XMLHttpRequest'
  }
});

// Interceptor para manejar errores globalmente
clienteAxios.interceptors.response.use(
  response => response,
  error => {
    if (error.code === 'ERR_NETWORK') {
      console.error('Error de conexión:', error);
      // Puedes redirigir a una página de error o mostrar notificación
      return Promise.reject({ 
        message: 'Error de conexión. Verifica tu internet.' 
      });
    }
    
    // Manejo de errores de CORS
    if (error.response?.data?.message?.includes('CORS')) {
      console.error('Error CORS:', error.config.url);
      return Promise.reject({
        message: 'Acceso no autorizado desde este dominio'
      });
    }

    // Manejo de otros errores
    return Promise.reject(error);
  }
);

export default clienteAxios;