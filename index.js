const Discord = require('discord.js');

const client = new Discord.Client();



client.login('ODI2MjEzNDA3Mzc2MDE1Mzgw.YGJNMg.axP9URqYDWEpPPVy0pXwzTukkrw');



client.on('ready', () => {

  console.log(`Logged in as ${client.user.tag}!`);

});



client.on('message', message => {



})



