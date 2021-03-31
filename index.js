const Discord = require('discord.js')
const bot = new Discord.Client()

bot.on('ready', () => {
    console.log('Connecté!')})
bot.on('message', message =>{
  if(message.content.startsWith('ping)){
  message.channel.send('pong!')
     };
     })
          Client.login(process.env.BOT_TOKEN)

    bot.login(process.env.BOT_TOKEN)
