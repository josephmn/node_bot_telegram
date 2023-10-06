require('dotenv').config();
const { Telegraf, Markup } = require('telegraf');
const { message } = require('telegraf/filters');
const { Cliente } = require('./src/clientes');

const bot = new Telegraf(process.env.BOT_TOKEN);
const CCliente = new Cliente();

// Parámetro API
const apiUrl = `http://localhost/apirest_php/`;

//#region "Menú interactivo para actualizar datos de clientes:"
let estadoFlag = false; // Variable para controlar el flujo de conversación
let nombreFlag = false;

let nuevoEstado = ""; // Variable donde guardamos el estado a actualizar
let nuevoNombre = "";
let nuevoTelefono = "";
let estadoMsg = "";

let est_nombre = "";
let clienteID = "";
let post_global = "";

// Manejador para el comando /help
bot.command('help', (ctx) => {
    ctx.reply('Lista de comandos disponibles:\
\n\n\
/activos - Muestra los clientes activos.\n\
/inactivos - Muestra los clientes inactivos.\n\
/actualizar - Actualiza el estado de un cliente (solo estado).');
});

// Listar Clientes Activos
bot.command('activos', (ctx) => {
    const estado = 1;
    est_nombre = "activos";
    listadoCliente(ctx, estado, est_nombre);
});

// Listar Clientes Inactivos
bot.command('inactivos', (ctx) => {
    const estado = 0;
    est_nombre = "inactivos"
    listadoCliente(ctx, estado, est_nombre);
});

bot.command('actualizar', (ctx) => {
    const teclado = Markup.inlineKeyboard([
        Markup.button.callback('Nombre', 'actualizar_nombre'),
        Markup.button.callback('Teléfono', 'actualizar_telefono'),
        Markup.button.callback('Estado', 'actualizar_estado'),
    ]);
    ctx.reply('Selecciona una opción para actualizar:', teclado);
});

//#region "Actualizar Estado"
bot.action('actualizar_estado', (ctx) => {
    const teclado = Markup.inlineKeyboard([
        Markup.button.callback('Activar', 'estado_activo'),
        Markup.button.callback('Inactivar', 'estado_inactivo'),
    ]);
    ctx.reply('Selecciona una opción:', teclado);
})

bot.action('estado_activo', (ctx) => {
    nuevoEstado = 1;
    estadoDescripcion = "Activo";
    estadoMsg = "Activado";
    estadoFlag = true;
    ctx.reply('Por favor, ingresa el ID del cliente que deseas actualizar como activo:');
})

bot.action('estado_inactivo', (ctx) => {
    nuevoEstado = 0;
    estadoDescripcion = "Inactivo";
    estadoMsg = "Inactivado";
    estadoFlag = true;
    ctx.reply('Por favor, ingresa el ID del cliente que deseas actualizar como inactivo:');
})
//#endregion

//#region "Actualizar Nombre" nombreFlag
bot.action('actualizar_nombre', (ctx) => {
    nombreFlag = true;
    ctx.reply('Por favor, ingresa el ID del cliente que deseas actualizar el nombre:');
})
//#endregion

bot.on(message('text'), async (ctx) => {

    if (nombreFlag) {
        clienteID = ctx.message.text;
        nombreFlag = false;
        ctx.reply(`Por favor, ingresa el nuevo nombre para el cliente ${clienteID}:`);
    } else if (estadoFlag) {
        clienteID = ctx.message.text;
        post_global = "estado";
        await procesoActualizar(ctx, estadoMsg, clienteID, nuevoEstado, nuevoNombre, nuevoTelefono);
        estadoFlag = false;
        actualizarVariables()
    } else if (!nombreFlag) {
        nuevoNombre = ctx.message.text;
        post_global = "nombre";
        await procesoActualizar(ctx, estadoMsg, clienteID, nuevoEstado, nuevoNombre, nuevoTelefono);
        actualizarVariables()
    }
    // else {
    //     ctx.reply('No entiendo tu mensaje. Por favor, selecciona una opción del menú o ingresa un ID de cliente si es necesario.');
    // }
});
//#region

bot.launch()

/***************************************************** FUNCIONES ********************************************************/

async function listadoCliente(ctx, estado, est_nombre) {
    const respuesta = await CCliente.GetCliente(estado, est_nombre);
    return ctx.reply(respuesta);
}

async function procesoActualizar(ctx, estadoMsg, clienteID, nuevoEstado, nuevoNombre, nuevoTelefono) {
    try {
        const cliente = await CCliente.obtenerCliente(clienteID);
        if (cliente.length > 0) {
            const clienteEstruc = {
                "Id": cliente[0].Id,
                "dni": cliente[0].dni,
                "nombre": (nuevoNombre.length === 0) ? cliente[0].nombre : `${nuevoNombre}`,
                "correo": cliente[0].correo,
                "genero": cliente[0].genero,
                "fechaNacimiento": cliente[0].fechaNacimiento,
                "telefono": (nuevoTelefono.length === 0) ? cliente[0].telefono : `${nuevoTelefono}`,
                "estado": (nuevoEstado.length === 0) ? cliente[0].estado : `${nuevoEstado}`,
                "token": "f3b6c141e457ea01331b90168266b8ef"
            }
            const respuesta = await CCliente.actualizarEstadoCliente(clienteEstruc, clienteID, estadoMsg, post_global); // envio estructura del nuevo clientes a actualizar
            ctx.reply(respuesta);
        } else {
            ctx.reply("No se encontro el cliente a actualizar, favor de intentar mas tarde o ingresar un ID válido.");
        }

    } catch (error) {
        console.log(error);
        ctx.reply(`Ocurrió un error al consultar cliente: ${clienteID}, favor de intentarlo mas tarde.`);
    }
}

function actualizarVariables(){
    nuevoNombre = "";
    nuevoTelefono = "";
    nuevoEstado = "";
    post_global = "";
}