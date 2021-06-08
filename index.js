const {
	Client,
	RichEmbed
} = require("discord.js")
const fetch = require("node-fetch")
const Database = require("@replit/database")
const server = require("./src/server")
const util = require("./util")
const fs = require('fs')
const commands = require("./commands.js")


const client = new Client()
const db = new Database()
const config = util.getConfig()
const lang = util.getLanguage("English");
const TOKEN = process.env["TOKEN"]

let prefix = config.prefix;

client.on("ready", () =>{
	console.log(`Logged in as ${client.user.tag}!`)

	client.user.setStatus(config.status['online']) // online, idle, invisible, dnd
	// console.log('Bot status: ', client.user.presence.status);

	client.user.setActivity(config.activity)

	// Register the category from config.js
	commands.registerCategories(config.categories)
	// Register all command from ./src/commands/
	commands.registerCommands()

	/* Find iterate one by one */
	//const testChannel = client.channels.find(x => x.name === 'test')
	//console.log(testChannel)
})

client.on("message", async msg => {
	// If bot, return
	if (msg.author.bot) return;

	/*if (!msg.member.hasPermission('MANAGE_MESSAGES')) {
		return msg.channel.send(
				"You cant use this command since you're missing `manage_messages` perm",
			);
	}*/

	var args;
	var blank = false;

	// Check if startsWith with Prefix
	if (msg.content.toLowerCase().startsWith(prefix)){
		args = msg.content.slice(prefix.length)
	}else{
		args = msg.content.slice()
		blank = true;
	}
	
	// Check if the arguments if defined
	if(args != undefined){
		args = args.split(' ');
	}

	let result = await commands.checkValidCmd(msg, args, blank);
	if(!result){
		// If the result is false and its not a 
		// Blank Category command, its a error.
		if (!blank){
			util.send(msg, lang.error.incoArgs.cmd);
		}
		return;
	}

	await commands.executeCmd(msg, args, blank)
})

server.keepAlive()
client.login(TOKEN)
