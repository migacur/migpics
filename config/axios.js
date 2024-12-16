import axios from 'axios';

// Crear una instancia de Axios
const clienteAxios = axios.create({
    baseURL: 'http://localhost:3000', 
});


export default clienteAxios;
