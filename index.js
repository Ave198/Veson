const Discord = require('discord.js')
const Veson = new Discord.Client()

Veson.on('ready', () => {
    console.log('Connecté!')})
Veson.on('message', message =>{
  if(message.content.startsWith('ping)){
  message.channel.send('pong!')
     };
     })

    Client.login(process.env.VESON_TOKEN);
