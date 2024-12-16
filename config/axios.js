import axios from 'axios';

// Crear una instancia de Axios
const clienteAxios = axios.create({
    baseURL: 'https://migpics-backend.onrender.com', 
});


export default clienteAxios;
