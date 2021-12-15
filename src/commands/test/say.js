const commands = require('../../../commands.js')
const discord = require('discord.js')
const util = require("../../util")
const lang = util.getLanguage()
const config = util.getConfig()

module.exports = class SayCommand extends commands.Command {
  constructor(){
    super({
      name: 'say',
      aliases: ['s'],
      args: [
        new commands.Argument({
          optional: false,	// Require the argument
					type: "string",
          missingError: lang.error.noArgs.arg,
          invalidError: lang.error.incoArgs.text
        })
      ],
      category: 'test',
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
											'** makes bot to response you with same phrases.')
			.addField('Permission:', config.permission[this.permLvl])
			.addField('Prefix:', `${util.capitalize(config.prefix)}, ${config.prefix}`)
			.addField('Aliases:', this.aliases) 
			.addField('Argument:', '**-<_String_>:** the phrases.\n')
			.setThumbnail('https://i.redd.it/7ff02zhiuym61.jpg')
			.setFooter(`Created by ${admin.username}`)
			.setTimestamp()

		return embed
	}

  /**
   * Send the same message to the channel.
	 * 
	 * @param msg: the admin class of discord bot
   * @param args: the argments of the command
	 * @param info: the info config for Music Module
	 * @version: 2.0
	 * @author: Zhijie
	 */
  execute(msg, args, info){
    msg.channel.send(args.join(' '));
		// console.log(msg)
  }
}