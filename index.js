const Discord = require('discord.js');

const client = new Discord.Client();



client.login('ODI2MTU2Mzc1ODk2NzUyMTI4.YGIYFQ.MePbud80NTWGULqflCaHGlqugW8');



client.on('ready', () => {

  console.log(`Logged in as ${client.user.tag}!`);

});



client.on('message', message => {



})



