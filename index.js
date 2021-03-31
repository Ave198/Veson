const Discord = require('discord.js')
const Veson = new Discord.Client()

Veson.on('ready', () => {
    console.log('Connecté!')})
Veson.on('message', message =>{
  if(message.content.startsWith('ping)){
  message.channel.send('pong!')
     };
     })

    Veson.login(process.env.BOT_TOKEN)
