const commands = require('../../../commands.js')
const discord = require('discord.js')
const util = require("../../util")
const lang = util.getLanguage()
const config = util.getConfig()
const fs = require('fs');

module.exports = class MinecraftCommand extends commands.Command {
  constructor(){
    super({
      name: 'mlist',
      aliases: [],
      args: [],
      category: 'minecraft',
      priority: 9,
      permLvl: 0
    });
  }

  /**
	 * Implementation for specific help command.
	 * 
   * @param admin: the admin class of discord bot 
	 * @return embed: the embed message. 
	 * @version: 1.0
	 * @author: Zhijie
	 */
	specificHelp(admin){
		const embed = new discord.MessageEmbed()
			.setTitle(`${util.capitalize(this.name)}`)
			.setColor('YELLOW')
			.setDescription(`The command **${this.name}` + 
											'** is used to list Member Server Status.')
			.addField('Permission:', config.permission[this.permLvl])
			.addField('Prefix:', `${util.capitalize(config.prefix)}, ${config.prefix}`)
			.addField('Aliases:', this.aliases) 
			.addField('Argument:', '**None:** list all Member Server Ip.')
			.setThumbnail('https://i.redd.it/7ff02zhiuym61.jpg')
			.setFooter(`Created by ${admin.username}`)
			.setTimestamp()

		return embed
	}

	/**
	 * The validator of the Ip.
	 * 
   * @param ip: the ip of the server
	 * @version: 1.0
	 * @author: Zhijie
	 */
	validator(ip){
		var expresion = /^(?!0)(?!.*\.$)((1?\d?\d|25[0-5]|2[0-4]\d)(\.|$)){4}$/
		return expresion.test(ip)
	}

	/**
	 * Change the Minecraft Server Ip.
	 * 
   * @param msg: the admin class of discord bot
   * @param args: the argments of the command
	 * @param info: the info config for Music Module
	 * @version: 1.0
	 * @author: Zhijie
	 */
  async execute(msg, args, info){
		const fileName = "minecraftIp.json"
		const json = JSON.parse(fs.readFileSync(fileName, 'utf8'));
		console.log(json)
		
		const embed = new discord.MessageEmbed()
			.setTitle(`Server List`)
			.setColor('YELLOW')
			.setDescription('Use j-mc **_<@someone>_** to check their server.')
			.addField('Juan:', json.JuanIp)
			.addField('Rober:', json.RoberIp)
			.setThumbnail('https://i.redd.it/7ff02zhiuym61.jpg')
			.setTimestamp()

		// msg.channel.send(JSON.stringify(json));
		
		msg.channel.send(embed);
		return;
	}
}