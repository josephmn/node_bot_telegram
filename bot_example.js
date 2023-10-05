require('dotenv').config();
const { Telegraf } = require('telegraf');
const { GETDataAPI } = require('./src/clientes/clientes');
const bot = new Telegraf(process.env.BOT_TOKEN);

// Parámetro variable para API
const pagina = '1';
const apiUrl = `http://localhost/apirest_php/clientes?page=${pagina}`;

bot.start((ctx) => {
    //
    console.log(ctx.from);
    console.log(ctx.chat);
    console.log(ctx.message);
    console.log(ctx.updateType);
    ctx.reply('Welcome ' + ctx.from.first_name + ' ' + ctx.from.last_name);
})

bot.help((ctx) => {
    //
    ctx.reply('Help!!');
})

bot.settings((ctx) => {
    //
    ctx.reply('Settings');
})

// comando personalizado
bot.command(['mycommand', 'Mycommand', 'MYCOMMAND', 'test'], (ctx) => {
    ctx.reply('my custom command..!!!')
})

// palabra
bot.hears('computer', ctx => {
    ctx.reply('Hey I am selling computer...')
})

// // evento
// bot.on('text', ctx => {
//     ctx.reply('estas texteando...')
// })

// para sticker
bot.on('sticker', ctx => {
    ctx.reply('oh! you like stickers...!!')
})

bot.mention('BotFather', (ctx) => {
    ctx.reply('You mentioned someone!!!')
})

bot.phone('999999555', ctx => {
    ctx.reply('this is phone number');
})

bot.hashtag('programing', ctx => {
    ctx.reply('hashtag!!!')
})

// Devolver una lista de clientes con la palabra -> "clientes"
bot.hears('clientes', ctx => {
    GetCliente(ctx);
})

// Usando un regex para encontrar la palabra clave dentro del texto
bot.on('text', (ctx) => {
    const mensaje = ctx.message.text.toLowerCase();

    const regex = /\bclientes\b/g; // busca la palabra "clientes" en el mensaje

    if (regex.test(mensaje)) {
        GetCliente(ctx);
    } else {
        ctx.reply('Lo siento, no entendí tu pregunta, me puedes formular nuevamente tu consulta');
    }
});

bot.launch()

function GetCliente(ctx) {
    fetch(apiUrl)
        .then(res => res.json())
        .then(res => {
            const clientes = res.map(item => `• Customer ${item.Id}: ${item.nombre}, Cel: ${item.telefono}`);
            const mensaje = clientes.join('\n'); // Unirá los elementos con un salto de línea
            return ctx.reply(`Los clientes son:\n${mensaje}`);
        })
        .catch(err => console.log(err));
}