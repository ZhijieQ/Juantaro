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


  execute(msg, args){
		var cmd = commands.getCmd(args[0], false)
		var admin = msg.client.users.cache.get(config.superusers[0])

		if(cmd){
			msg.channel.send(cmd.specificHelp(admin));
			return
		}

		const page1 = new discord.MessageEmbed()
			.setTitle("Help Menu - Page 1")
			.setColor('GREEN')
			.setDescription("Those commands dont need the prefix")
			.setThumbnail('https://i.redd.it/7ff02zhiuym61.jpg')
			.setFooter(`Created by ${admin.username}`)
			.setTimestamp()

		for (var command of commands.blankCommands){
			page1.addField(`${util.capitalize(command[0])}:`, command[1].help(), true)
		}

		const page2 = new discord.MessageEmbed()
			.setTitle("Help Menu - Page 2")
			.setColor('BLUE')
			.setDescription("Those commands need the prefix: j- or J-")
			.setThumbnail('https://i.redd.it/7ff02zhiuym61.jpg')
			.setFooter(`Created by ${admin.username}`)
			.setTimestamp()

		for (var command of commands.commands){
			page2.addField(`${util.capitalize(command[0])}:`, command[1].help(), true)
		}

		const pages = [
			page1,
			page2
		]

		const emojis = ["⏪", "⏩"]
		const timeout = "100000"

		pagination(msg, pages, emojis, timeout);
  }
}