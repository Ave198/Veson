const { ShardingManager } = require("discord.js");
const config = require("./informations/config.json");
const manager = new ShardingManager('./main.js',
 {
	totalShards: "auto",
  	respawn: true,
  	token:"ODI2MTU2Mzc1ODk2NzUyMTI4.YGIYFQ.ESxFbfanT8Yum3TRj2Th2KScGQE
	  " );
	  Client.login ("ODI2MTU2Mzc1ODk2NzUyMTI4.YGIYFQ.ESxFbfanT8Yum3TRj2Th2KScGQE
	  "); 
	}

manager.spawn();
// Le bot gère les shards tout seul.