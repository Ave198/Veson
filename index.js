const Discord = require('discord.js')
const veson = new Discord.Client()

veson.on('ready', () => {
    console.log('Connecté!')})
veson.on('message', message =>{
  if(message.content.startsWith('ping)){
  message.channel.send('pong!')
     };
     })
          Client.login(process.env.BOT_TOKEN)

    veson.login(process.env.BOT_TOKEN)
