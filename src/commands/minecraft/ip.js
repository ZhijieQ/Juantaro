const commands = require('../../../commands.js')
const discord = require('discord.js')
const util = require("../../util")
const lang = util.getLanguage()
const config = util.getConfig()
const fs = require('fs');

module.exports = class MinecraftCommand extends commands.Command {
  constructor(){
    super({
      name: 'ip',
      aliases: [],
      args: [
				 new commands.Argument({
          optional: false,
					type: "string",
          missingError: lang.error.noArgs.mention,
          invalidError: lang.error.incoArgs.text
        })
			],
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
			.addField('Argument:', '**xxx.xxx.xxx.xxx:** the new IP of the server.')
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
	 * @param info: the info config:
	 * 		-blank: True if it is a blank command
	 * @version: 1.0
	 * @author: Zhijie
	 */
  async execute(msg, args, info){
		if(msg.author.id != "433633517902102537" && msg.author.id != "322787975630946306"){
			msg.channel.send(`${msg.author}, You dont have permission to change Ip!`)
			return
		}

		if(this.validator(args[0]) == true){
			const dict = {
				ip : args[0]
			}

			let data = JSON.stringify(dict);
			fs.writeFile('minecraftIp.json', data, (err) => {
				if (err) throw err;
				msg.channel.send('The Ip of the Minecraft Server is Changed!');
			});
		}else{
			msg.channel.send('Pls check the IP first before using this command.')
		}
	}
}