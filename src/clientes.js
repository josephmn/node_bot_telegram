const { Router } = require('../router/router');
const axios = require('axios');

const apiUrl = 'http://localhost/apirest_php/clientes';
const apiRouter = new Router(apiUrl);

class Cliente {
    constructor() {
        this.APIRouter = apiRouter;
    }

    async GetCliente(estado, nom_estado) {
        const UrlCliente = this.APIRouter.getRouteUrl(`?estado=${estado}`);
        try {
            const response = await axios.get(UrlCliente);
            if (response.status === 200) {
                if (response.data.length > 0) {
                    const formato = response.data.map(item => `• Id: ${item.Id}: ${item.nombre}, Cel: ${item.telefono}`);
                    const mensaje = formato.join('\n'); // Unirá los elementos con un salto de línea
                    return `Los clientes ${nom_estado} son:\n${mensaje}`;
                } else {
                    return `No existen clientes ${nom_estado} por el momento ☹️`;
                }
            } else {
                throw new Error('La solicitud a la API falló.');
            }
        } catch (error) {
            throw error;
        }
    }

    // Método para obtener un cliente por ID
    async obtenerCliente(clienteId) {
        const UrlCliente = this.APIRouter.getRouteUrl(`?id=${clienteId}`);
        try {
            const response = await axios.get(UrlCliente);
            if (response.status === 200) {
                return response.data;
            } else {
                throw new Error('La solicitud a la API falló.');
            }
        } catch (error) {
            throw error;
        }
    }

    // Método para actualizar datos de clientes
    async actualizarEstadoCliente(json, clienteID, estadoMsg, post_global) {
        let mensaje = "";
        try {
            const response = await axios.put(apiUrl, json);
            if (response.status === 200) {
                try {
                    if (response.data.status == "ok" && response.data.result.clienteId == clienteID) {
                        switch (post_global) {
                            case "nombre":
                                mensaje = `Cliente con Id: ${clienteID}, fue actualizado correctamente su nombre a: ${json.nombre} ✌️`;
                                break;
                            case "telefono":
                                mensaje = `Cliente ${json.nombre}, con Id: ${clienteID}, fue actualizado correctamente su teléfono al número: ${nuevoTelefono} ✌️`;
                            break;
                            case "estado":
                                mensaje = `Cliente con Id: ${clienteID}, ${json.nombre}, fue ${estadoMsg} correctamente ✌️`;
                            break;
                        }
                        return mensaje;
                    } else {
                        return `La respuesta a la actualización fue: ${response.data.status}, debido: ${response.data.result.error_msg}`;
                    }
                } catch (error) {
                    return `Error en respuesta del API`;
                }

            } else {
                throw new Error('La solicitud a la API falló.');
            }
        } catch (error) {
            throw error;
        }
    }
}

module.exports = {
    Cliente,
};