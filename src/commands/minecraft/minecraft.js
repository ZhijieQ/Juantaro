const commands = require('../../../commands.js')
const discord = require('discord.js')
const util = require("../../util")
const lang = util.getLanguage()
const config = util.getConfig()
const fs = require('fs');
var ms = require('minestat');

module.exports = class MinecraftCommand extends commands.Command {
  constructor(){
    super({
      name: 'minecraft',
      aliases: ['mc'],
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
											'** is used to check Juantaro Server Status.')
			.addField('Permission:', config.permission[this.permLvl])
			.addField('Prefix:', `${util.capitalize(config.prefix)}, ${config.prefix}`)
			.addField('Aliases:', this.aliases) 
			.addField('Argument:', 'None:** Check Juantaro Server Status.')
			.setThumbnail('https://i.redd.it/7ff02zhiuym61.jpg')
			.setFooter(`Created by ${admin.username}`)
			.setTimestamp()

		return embed
	}

	/**
	 * Minecraft Server Status Check.
	 * 
   * @param msg: the admin class of discord bot
   * @param args: the argments of the command
	 * @param info: the info config for Music Module
	 * @version: 1.0
	 * @author: Zhijie
	 */
  async execute(msg, args, info){
		if (!fs.existsSync("./minecraftIp.json")) {
			msg.channel.send(`There is an internal bug, pls contact with <@!${config.superusers[0]}> as soon as possible.`)
			return
		}

		const rawdata  = fs.readFileSync('minecraftIp.json');
		const server = JSON.parse(rawdata).ip;
		console.log(server)

		ms.init(server, 25565, result => {
			if(ms.online){
				const embed = new discord.MessageEmbed()
					.setTitle("Juantaro Server Status")
					.addField('Server IP:', ms.address)
					.addField('Information:', "Server is online running version " +
																		 ms.version +
																		 " with " +
																		 ms.current_players +
																		 " out of " +
																		 ms.max_players +
																		 " players.")
					.addField('Message of the day:', ms.motd)
					.addField('Latency:', ms.latency + "ms")
					.setColor('RANDOM')
					.setTimestamp()
				console.log("Server is online running version " + ms.version + " with " + ms.current_players + " out of " + ms.max_players + " players.");
				console.log("Message of the day: " + ms.motd);
				console.log("Latency: " + ms.latency + "ms");
				msg.channel.send(embed);
			}else{
				msg.channel.send("Server is offline!");
			}
		});
	}
}