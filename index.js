const Discord = require('discord.js');

const client = new Discord.Client();



client.login('ODI2MTU2Mzc1ODk2NzUyMTI4.YGIYFQ.aNxX3rAlSP1o4u2nsV5aiPJdVig');



client.on('ready', () => {

  console.log(`Logged in as ${client.user.tag}!`);

});



client.on('message', message => {



})



