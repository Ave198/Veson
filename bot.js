require("./server")();

require("dotenv").config();
const Discord = require("discord.js");
const Statcord = require("statcord.js");
const blapi = require("blapi");
const config = require("./config.json");
const bot = new Discord.Client({ disableEveryone: true });
const axios = require("axios");
var cache = require("memory-cache");
bot.login(process.env.bot_token);

const enabled = true;
const STAGING = false;

const permissionsError =
  "You need `MANAGE_MESSAGES` permissions in order to run this command.";

const statcord = new Statcord.Client({
  key: process.env.statcord,
  client: bot,
});

bot.on("ready", async () => {
  console.log("CuRe is now online in " + bot.guilds.cache.size + " guilds.");
  if (!STAGING) {
    await statcord.autopost();

    const botListAPIKeys = {
      "top.gg": process.env.topgg_token,
      "arcane-center.xyz": process.env.arcane_center_token,
      "botlist.space": process.env.botlistspace_token,
      "botsfordiscord.com": process.env.botsfordiscord_token,
      "discord.bots.gg": process.env.discordbotsgg_token,
      "discord.boats": process.env.discordboats_token,
      "discordbotlist.com": process.env.discordbotlistcom_token,
    };

    blapi.handle(bot, botListAPIKeys, 60);
  }

  bot.user
    .setActivity("for "+config.prefix +"help", { type: "WATCHING" })
    .then((presence) =>
      console.log(
        `Activity set: ${presence.game ? presence.game.name : "none"}`
      )
    )
    .catch(console.error);
});
if (!STAGING) {
statcord.on("autopost-start", () => {
  console.log("Started statcord autopost.");
});

statcord.on("post", (status) => {
  if (!status) console.log("Posted to statcord.");
  else console.error(status);
});
}
const statcordPost = async (cmd, message) => {
  try {
    return statcord.postCommand("cmd", message.author.id);
  } catch (e) {
    console.log("Failed to post command stats to statcord.");
  }
};

bot.on("message", async (message) => {
  if (message.author.bot || message.guild == null) return;
  let messageBody = message.content.split(" ");
  if (message.content.substring(0, 1) !== config.prefix) return;
  const cmd = messageBody[0].substring(1);

  if (cmd == "help") {
    statcordPost("help", message);
    const embed = new Discord.MessageEmbed()
      .setColor("#2F3136")
      .setTitle("**Veson**")
      .setDescription(
        "Veson vous permet d'afficher des réponses aléatoires motivationellles, de stalker des utilisateurs, et de sortir des biographies de tueurs en séries quand il lit leurs noms"
      )
      .addField(
        config.prefix + "chine` - `bonne chance à vous pour vos projet en ca bas monde, objectif is very important`",
        "**Creates a message trigger.** Whenever a message contains the trigger string, the bot will respond with the response string.\nThe trigger and response arguments are separated by ` - `.\n_Want features like random responses, automatic trigger message deletion, author mentions in responses, wildcards, DM responses, delayed responses, and more?_ Join the [bot support server](https://discord.gg/vhVPtYN6Dw) to get access to them!"
      )
      .addField(
        config.prefix + "femboy' - 'porn + brain: ile autosuffisante"
      )
      .addField(
        config.prefix + "list",
        "Displays the server's **trigger list**."
      )
      .addField(
        config.prefix + "remove `trigger index`",
        "**Deletes a trigger.**\nTo get a trigger's index, run `" +
          config.prefix +
          "list`."
      )
      .addField(
        config.prefix + "ping",
        "Displays the latency of bot to the Discord's servers."
      )
      //.addField(config.prefix + "stats", "Shows the bot's usage statistics.")
      


    return message.channel.send(embed);
  } else if (cmd == "list") {
    statcordPost("list", message);
    return message.channel.send(
      "View this server's triggers at the following link: https://cure.jkm.sh/triggers?guild=" +
        message.guild.id
    );
  } else if (cmd == "ping") {
    statcordPost("ping", message);
    const m = await message.channel.send("Pong 🏓");
    return m.edit(
      `Pong 🏓\nBot latency is ${
        m.createdTimestamp - message.createdTimestamp
      }ms. Discord API Latency is ${bot.ws.ping}ms`
    );
  } else if (cmd == "stats") {
    statcordPost("stats", message);
    let guildNum = 0;
    let channelNum = 0;
    let memberNum = 0;
    bot.guilds.cache.map((guild) => {
      guildNum++;
      guild.channels.cache.map((channel) => {
        channelNum++;
      });
      memberNum += guild.memberCount;
    });
    return message.channel.send(
      "I help **" +
        memberNum +
        " users** in **" +
        channelNum +
        " channels** of** " +
        guildNum +
        " servers!**"
    );
  }
});

const checkManageMessagePerms = (message) => {
  if (!message.channel.permissionsFor(message.member).has("MANAGE_MESSAGES")) {
    return true;
  }
  return false;
};

//add trigger
bot.on("message", async (message) => {
  if (message.author.bot || message.guild == null) return;
  const guild = message.guild.id;
  if (
    message.content.substring(0, config.prefix.length + "create".length) ==
    config.prefix + "create"
  ) {
    statcordPost("create", message);
    let content = message.content
      .substring(config.prefix.length + "create".length + 1)
      .split(" - ");
    if (content.length < 2) {
      return await message.channel.send(
        "You did not include an argument. Try again."
      );
    }

    if (checkManageMessagePerms(message)) {
      return message.channel.send(permissionsError);
    }

    axios
      .get(process.env.storage_service + guild)
      .then(async function (response) {
        let after;
        if (JSON.stringify(response.data) == "{}") {
          after = JSON.parse(
            '{"' +
              content[0] + //trigger
              '":"' +
              content[1] + //response
              '"}'
          );
        } else {
          let before = JSON.stringify(response.data);
          after = JSON.parse(
            before.substring(0, before.length - 1) +
              ',"' +
              content[0] + //trigger
              '":"' +
              content[1] + //response
              '"}'
          );
        }
        pushNewTriggerList(message, after);
      })
      .catch(async function (error) {
        console.log(
          "Error retrieving trigger list. Cannot add new trigger.\n" + error
        );
        //if not triggers exist bc of 404 error try again here
        after = JSON.parse(
          '{"' +
            content[0] + //trigger
            '":"' +
            content[1] + //response
            '"}'
        );
        pushNewTriggerList(message, after);
      });
  }
});

async function pushNewTriggerList(message, updatedList, removeTrigger = false) {
  const guild = message.guild.id;
  axios
    .put(process.env.storage_service + guild, updatedList)
    .then(async function (response) {
      let addOrDelete = "added";
      if (removeTrigger) {
        addOrDelete = "removed";
      }
      cache.del(guild);
      return await message.channel.send(
        "Trigger " +
          addOrDelete +
          " successfully. To see the new trigger list run `" +
          config.prefix +
          "list`.\nIt can take up to 30 seconds for the updated trigger list to take effect."
      );
    })
    .catch(async function (error) {
      return await message.channel.send(
        "Error adding new trigger.  \n" + error
      );
    });
}

//remove trigger cmd
bot.on("message", async (message) => {
  if (message.author.bot || message.guild == null) return;

  const guild = message.guild.id;
  const args = message.content.split(" ");
  const command = args[0];
  if (
    command == config.prefix + "remove" ||
    command == config.prefix + "delete"
  ) {
    if (args[1] == null || isNaN(args[1])) {
      return message.channel.send(
        "Error: Specify a trigger index to remove.\nCommand Usage: `"+config.prefix +"remove [trigger index]`\nTo see the trigger list run `" +
          config.prefix +
          "list`.\n\nRun `"+config.prefix +"help` for more information."
      );
    }
    if (checkManageMessagePerms(message)) {
      return message.channel.send(permissionsError);
    }
    statcordPost("remove", message);
    //check if number and is in bounds
    axios
      .get(process.env.storage_service + guild)
      .then(async function (response) {
        let before = response.data;
        let keys = Object.keys(response.data);
        if (args[1] > keys.length - 1 || args[1] < 0) {
          return message.channel.send(
            "Trigger index out of bounds.\nTo see the trigger list run `" +
              config.prefix +
              "list`."
          );
        }
        let remover = keys[args[1]];
        delete before[remover];
        pushNewTriggerList(message, before, true);
      })
      .catch(async function (error) {
        return console.log(
          "Error retrieving trigger list. Cannot remove trigger.  \n" + error
        );
      });
  }
});

const triggerCheck = async (message, triggers) => {
  const messageContent = message.content.toLowerCase();

  const contains = (testString, subString) => {
    var subStringParts = subString.split("{*}");
    var testRegex = new RegExp(subStringParts.join(".*"));
    return testRegex.test(testString);
  };

  const checkTriggerDelete = (trigger, message) => {
    if (trigger.includes("{DELETE}")) {
      statcordPost("DELETE", message);
      try {
        message.delete();
      } catch (e) {
        message.reply(
          "Error deleting message. Please contact an administrator to grant CuRe `MANAGE_MESSAGE` permissions in this channel."
        );
      }
    }
  };

  const parseResponse = (response, message) => {
    if (response.includes("{AUTHOR}")) {
      statcordPost("AUTHOR", message);
      return response.split("{AUTHOR}").join(message.author);
    } else {
      return response;
    }
  };
  //reply, dm
  const sendTrigger = (message, trigger, response) => {
    statcordPost("RESPONSE", message);

    let delay = 0;
    if (response.match(/{DELAY: [1-9]\d*}/)) {
      const start = response.indexOf("{DELAY: ") + 8;
      const end = response.indexOf("}");
      const delay = new Number(response.substring(start, end));
    }

    const findDelay = (response) => {
      if (response.match(/{DELAY: [1-9]\d*}/)) {
        statcordPost("DM RESPONSE", message);
        const start = response.indexOf("{DELAY: ") + 8;
        const end = response.indexOf("}");
        return Number(response.substring(start, end));
      }
      return 0;
    };

    const parseResponse = (response) => {
      let newResponse = response.replace("{DM}", "");
      newResponse =
        response.substring(0, response.indexOf("{DELAY: ")) +
        response.substring(response.indexOf("}") + 1);
      return newResponse;
    };
    setTimeout(() => {
      //DM response
      try {
        if (response.includes("{DM}")) {
          statcordPost("DM RESPONSE", message);
          return message.author.send(parseResponse(response));
        }
        //normal response
        return message.channel.send(parseResponse(response));
      } catch (e) {
        console.log("Error sending trigger. Missing permissions.");
      }
    }, findDelay(response) * 1000);
  };

  for (i = 0; i < Object.keys(triggers).length; i++) {
    const trigger = Object.keys(triggers)[i];
    const parsedTrigger = trigger.toLowerCase().replace("{delete}", "");
    if (
      trigger.includes("{*}")
        ? contains(messageContent, parsedTrigger)
        : messageContent.includes(parsedTrigger)
    ) {
      const response = triggers[trigger];
      if (response.indexOf("{RANDOM}") == 0) {
        statcordPost("RANDOM", message);
        const options = response
          .slice("{RANDOM}".length + 1, response.length - 1)
          .split(", ");
        //random response
        await sendTrigger(
          message,
          trigger,
          parseResponse(
            options[Math.floor(Math.random() * options.length)],
            message
          )
        );
      }
      //normal response
      else {
        await sendTrigger(message, trigger, parseResponse(response, message));
      }
      //check if trigger should be deleted
      return checkTriggerDelete(trigger, message);
    }
  }
};

//message trigger functionality
if (enabled) {
  bot.on("message", async (message) => {
    //ignore if bot or if prefixed
    if (
      message.author.bot ||
      message.content.substring(0, 1) == config.prefix ||
      message.guild == null
    ) {
      return;
    }

    const guild = message.guild.id;
    if (cache.get(guild)) {
      return triggerCheck(message, cache.get(guild));
    } else {
      //guild not in cache
      await axios
        .get(process.env.storage_service + guild)
        .then(async function (response) {
          cache.put(guild, response.data, 60000);
          return triggerCheck(message, cache.get(guild));
        })
        .catch(async function (error) {
          //console.log("Error fetching trigger list. Cannot put into cache.);
        });
    }
  });
}
