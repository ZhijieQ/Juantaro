const {
	Client,
	RichEmbed
} = require("discord.js")
const fetch = require("node-fetch")
const Database = require("@replit/database")
const server = require("./src/server")
const util = require("./util")
const fs = require('fs')


const client = new Client()
const db = new Database()
const config = util.getConfig()
const lang = util.getLanguage("English");
const TOKEN = process.env["TOKEN"]
const mySecret = process.env['TOKEN']

let prefix = config.prefix;

const commands = require('./commands.js')

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

	if (!msg.content.toLowerCase().startsWith(prefix)){
		if (msg.content === "Hello"){
			util.send(msg, `Hello ${msg.author}!`)
		}

		if (msg.content === "sije es puto?"){
			util.send(msg, `Si lo es xd`)
		}

		if (msg.content.startsWith("clear")) {
			/*if (!msg.member.hasPermission('MANAGE_MESSAGES')) {
				return msg.channel.send(
						"You cant use this command since you're missing `manage_messages` perm",
					);
			}*/
			const number = Number(msg.content.trim().split(/\s+/)[1])
			if(!number){
				maxNumber = 100
			}else{
				maxNumber = Math.min(number+1, 100)
			}
			msg.channel.bulkDelete(maxNumber)
						.then(messages => console.log(`Bulk deleted ${messages.size} messages`))
						.catch(console.error);
		}
		return;
	}

	// Get the arguments
	let args = msg.content.slice(prefix.length)

	// Check if the arguments if defined
	if(args != undefined){
		args = args.split(' ');
	}

	let result = await commands.checkValidCmd(msg, args, prefix);
	if(!result){
		util.send(msg, lang.error.incoArgs.cmd)
		return
	}
	await commands.executeCmd(msg, args)

})

server.keepAlive()
client.login(TOKEN)
