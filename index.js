const Discord = require('discord.js')
const bot = new Discord.Client()

bot.on('ready', () => {
    console.log('Connecté!')})
bot.on('message', message =>{
  if(message.content.startsWith('ping)){
  message.channel.send('pong!')
     };
     })
    bot.login('ODI2MTU2Mzc1ODk2NzUyMTI4.YGIYFQ.ESxFbfanT8Yum3TRj2Th2KScGQE')
