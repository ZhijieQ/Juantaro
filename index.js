const {
	Client,
	RichEmbed
} = require("discord.js")
const fetch = require("node-fetch")
const Database = require("@replit/database")
const server = require("./src/server")
const util = require("./src/util")
const fs = require('fs')
const commands = require("./commands.js")

const client = new Client()
const db = new Database()
const config = util.getConfig()
const lang = util.getLanguage();
const TOKEN = process.env["TOKEN"]

let startTime = Date.now();
let prefix = config.prefix;

client.on("ready", () =>{
	// Set bot Status (online, idle, invisible, dnd)
	client.user.setStatus(config.status['online'])

	// Set bot activity
	client.user.setActivity(config.statusBOT);

	// Register the category from config.js
 	commands.registerCategories(config.categories);

	// Register all command from ./src/commands/
 	commands.registerCommands();

 	let time = Date.now() - startTime;
	console.log(`Logged in as ${client.user.tag}! Used Time: ${time}ms`);
	
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
	
	var listArgs = []
	// Check if the arguments if defined
	// If the arguments has sintax '(x x x)',
	// will be splited to get 'x x x'
	if(args != undefined){
		// Split (
		args = args.split(' (')

		// For each arg, check if contains ')'
		for(let arg of args){
			// If contains ')', split it
			if(arg.includes(')')){
				arg.split(') ').forEach(element => {
					if(element){
						listArgs.push(element)
					}
				})
			}
			// If not contains, split the space
			else{
				arg.split(' ').forEach(element => {
					listArgs.push(element)
				})
			}
		}
		//console.log(listArgs)
		//args = args.split(' ');
	}

	let result = await commands.checkValidCmd(msg, listArgs, blank);
	if(!result){
		// If the result is false and its not a 
		// Blank Category command, its a error.
		if (!blank){
			util.send(msg, lang.error.incoArgs.cmd);
		}
		return;
	}

	await commands.executeCmd(msg, listArgs, blank)
})

server.keepAlive()
client.login(TOKEN).catch((err) => {
	console.error(err);
  process.exitCode = 1;
  process.exit();
})
