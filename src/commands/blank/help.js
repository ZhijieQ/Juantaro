// const commands because commands contains the class Command and Argument
const commands = require('../../../commands.js')
const discord = require('discord.js')
const util = require("../../util")
const lang = util.getLanguage()
const config = util.getConfig()
const pagination = require('discord.js-pagination')
const client = new discord.Client()


module.exports = class ClearCommand extends commands.Command {
  constructor(){
    super({
      name: 'help',
      aliases: ['Help', 'man', 'Man'],
      args: [
        new commands.Argument({
          optional: true,
					type: "string",
          missingError: lang.error.noArgs.arg,
          invalidError: lang.error.incoArgs.text
        })
      ],
      category: 'blank',
      priority: 1,
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
											'** is use for consult all categories of command.')
			.addField('Permission:', config.permission[this.permLvl])
			.addField('Prefix:', `None`)
			.addField('Aliases:', this.aliases) 
			.addField('Argument:', '**-None:** all categories command.\n' +
														 '**-String:** specific command.')
			.setThumbnail('https://i.redd.it/7ff02zhiuym61.jpg')
			.setFooter(`Created by ${admin.username}`)
			.setTimestamp()

		return embed
	}

	/**
	 * Send the pagination of the commands.
	 * 
   * @param msg: the admin class of discord bot
   * @param args: the argments of the command
	 * @version: 1.0
	 * @author: Zhijie
	 */
  execute(msg, args){
		// Get the command from arg[0]
		var cmd = commands.getCmd(args[0], false)

		// Get the client class from admin id
		var admin = msg.client.users.cache.get(config.superusers[0])

		// If the command is not null, that means it is a specific command
		if(cmd){
			msg.channel.send(cmd.specificHelp(admin));
			return
		}

		// If is not specific command, it is a general command.
		// So we create the diferents command page for different categories

		const page1 = new discord.MessageEmbed()
			.setTitle("Help Menu - Blank Command")
			.setColor('GREEN')
			.setDescription("Those commands dont need the prefix")
			.setThumbnail('https://i.redd.it/7ff02zhiuym61.jpg')
			.setFooter(`Created by ${admin.username}`)
			.setTimestamp()
		
		const page2 = new discord.MessageEmbed()
			.setTitle("Help Menu - Imgs Command")
			.setColor('Yellow')
			.setDescription("Those commands need the prefix: j- or J-")
			.setThumbnail('https://i.redd.it/7ff02zhiuym61.jpg')
			.setFooter(`Created by ${admin.username}`)
			.setTimestamp()
		
		const page3 = new discord.MessageEmbed()
			.setTitle("Help Menu - General Command")
			.setColor('BLUE')
			.setDescription("Those commands need the prefix: j- or J-")
			.setThumbnail('https://i.redd.it/7ff02zhiuym61.jpg')
			.setFooter(`Created by ${admin.username}`)
			.setTimestamp()
		
		const page4 = new discord.MessageEmbed()
			.setTitle("Help Menu - Admin Command")
			.setColor('RED')
			.setDescription("Those commands need the prefix: j- or J-")
			.setThumbnail('https://i.redd.it/7ff02zhiuym61.jpg')
			.setFooter(`Created by ${admin.username}`)
			.setTimestamp()

		for (var command of commands.commands){
			if (command[1].category == 'blank') {
				page1.addField(`${util.capitalize(command[0])}:`, command[1].help(), true)
			}else if (command[1].category == 'imgs') {
				page2.addField(`${util.capitalize(command[0])}:`, command[1].help(), true)
			}else if (command[1].category == 'admin') {
				page4.addField(`${util.capitalize(command[0])}:`, command[1].help(), true)
			}else {
				page3.addField(`${util.capitalize(command[0])}:`, command[1].help(), true)
			}
		}

		const pages = [
			page1,
			page2,
			page3,
			page4
		]

		const emojis = ["⏪", "⏩"]
		const timeout = "100000"

		pagination(msg, pages, emojis, timeout);
  }
}