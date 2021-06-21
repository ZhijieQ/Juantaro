// const { Commands } because we only need the class Command and not Argument
// const { Command } = require('../../../commands.js')
const commands = require('../../../commands.js')
const discord = require('discord.js')
const util = require("../../util")
const lang = util.getLanguage()
const config = util.getConfig()

module.exports = class TestCommand extends commands.Command {
  constructor(){
    super({
      name: 'test',
      aliases: ['Test'],
			args: [
				new commands.Argument({
          optional: true,
					type: "mention",
          missingError: lang.error.noArgs.mention,
          invalidError: lang.error.incoArgs.text
        })
			],
      category: 'blank',
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
											'** is use for test the bot.')
			.addField('Permission:', config.permission[this.permLvl])
			.addField('Prefix:', `None`)
			.addField('Aliases:', this.aliases)
			.addField('Argument:', '**-None:** response a message to **Author**.\n' +
														 '**-@someone:** response a message to **@someone**.')
			.setThumbnail('https://i.redd.it/7ff02zhiuym61.jpg')
			.setFooter(`Created by ${admin.username}`)
			.setTimestamp()

		return embed
	}

	/**
	 * Send a message to channel.
	 * 
     * @param msg: the admin class of discord bot
     * @param args: the argments of the command
	 * @version: 1.0
	 * @author: Zhijie
	 */
  execute(msg){
    const name = msg.content.trim().split(/\s+/)[1]

		if (name) {
		  msg.channel.send(`Fuck you ${name}!`)
		}else{
			msg.channel.send(`Fuck you ${msg.author}!`)
		}
  }
}