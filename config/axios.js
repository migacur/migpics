import axios from 'axios';

const clienteAxios = axios.create({
  baseURL: 'https://migpics-backend.onrender.com/api', // 👈 Agrega /api
  withCredentials: true, // 👈 Fundamental para cookies
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
    'X-Requested-With': 'XMLHttpRequest'
  }
});


export default clienteAxios;