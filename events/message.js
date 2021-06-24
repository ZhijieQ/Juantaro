const commands = require('../commands.js');
const db = require('../src/database/db.js');
const util = require('../src/util.js');
const Discord = require('discord.js')

const config = util.getConfig();
let prefix = config.prefix;

module.exports = async (client, msg) => {
  // If bot, return
	if (msg.author.bot) return;

	/*if (!msg.member.hasPermission('MANAGE_MESSAGES')) {
		return msg.channel.send(
				"You cant use this command since you're missing `manage_messages` perm",
			);
	}*/

	var args;
	var info = {};
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
		args = args.split(' "')

		// For each arg, check if contains ')'
		for(let arg of args){
			// If contains ')', split it
			if(arg.endsWith('"')){
				arg.split('"').forEach(element => {
					if(element){
						listArgs.push(element)
					}
				})
			}else if(arg.includes('"')){
				arg.split('" ').forEach(element => {
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
	db.coinSystem.coins.updateCoin(msg.author.id, 2)

	// Set info config
	info['blank'] = blank
	info['client'] = client
	info['discord'] = Discord
	await commands.executeCmd(msg, listArgs, info)
}