const commands = require('../../../commands.js')
const discord = require('discord.js')
const util = require("../../util")
const lang = util.getLanguage()
const config = util.getConfig()

module.exports = class ClearCommand extends commands.Command {
  constructor(){
    super({
      name: 'clear',
      aliases: ['clean'],
      args: [
        new commands.Argument({
          optional: true,
					type: "number",
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
											'** is used to clean the message.')
			.addField('Permission:', config.permission[this.permLvl])
			.addField('Prefix:', `None`)
			.addField('Aliases:', this.aliases)
			.addField('Argument:', '**-None:** clean 100 message.\n' +
														 '**-<_Number_>:** clean number message.')
			.setThumbnail('https://i.redd.it/7ff02zhiuym61.jpg')
			.setFooter(`Created by ${admin.username}`)
			.setTimestamp()

		return embed
	}

	/**
	 * Clear the args[0] number of the message.
	 * 
   * @param msg: the admin class of discord bot
   * @param args: the argments of the command
	 * @param info: the info config for Music Module
	 * @version: 2.0
	 * @author: Zhijie
	 */
  execute(msg, args, info){
		const number = Number(args[0])
		var maxNumber;

		// If number does not exist, set to 100
    if(!number){
			maxNumber = 100
		}
		// If number exist, set the minimun of number+1 and 100
		// Use number+1 cause clear command is another message
		else{
			maxNumber = Math.min(number+1, 100)
		}
		msg.channel.bulkDelete(maxNumber)
					.then(messages => console.log(`Bulk deleted ${messages.size} messages`))
					.catch(console.error);
  }
}