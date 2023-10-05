const axios = require('axios');

async function obtenerCliente(ruta, id) {
    const apiUrl = `http://localhost/apirest_php/${ruta}?id=${id}`; // Reemplaza con la URL de tu API REST
    try {
        const response = await axios.get(apiUrl);
        if (response.status === 200) {
            return response.data;
        } else {
            throw new Error('La solicitud a la API falló.');
        }
    } catch (error) {
        throw error;
    }
}

async function actualizarEstadoCliente(ruta, json) {
    const apiUrl = `http://localhost/apirest_php/${ruta}`; // Reemplaza con la URL de tu API REST
    try {
        const response = await axios.put(apiUrl, json);
        if (response.status === 200) {
            return response.data;
        } else {
            throw new Error('La solicitud a la API falló.');
        }
    } catch (error) {
        throw error;
    }
}

module.exports = {
    obtenerCliente,
    actualizarEstadoCliente
};