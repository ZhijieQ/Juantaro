const commands = require('../../../commands.js')
const discord = require('discord.js')
const util = require("../../util")
const lang = util.getLanguage()
const config = util.getConfig()

module.exports = class IdChannelCommand extends commands.Command {
  constructor(){
    super({
      name: 'idC',
      aliases: ['idchannel'],
      args: [
        new commands.Argument({
          optional: true,
          type: 'channel',
          missingError: lang.error.noArgs.mention,
          invalidError: lang.error.incoArgs.text
        })
      ],
      category: 'admin',
      priority: 0,
      permLvl: 3
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
											'** is used to get the Id of the **Channel**')
			.addField('Permission:', config.permission[this.permLvl])
			.addField('Prefix:', `${util.capitalize(config.prefix)}, ${config.prefix}`)
			.addField('Aliases:', this.aliases) 
			.addField('Argument:', '**-None:** get Id of this channel.\n' +
														 '**-__#channel__:** get Id of **__#channel__**.')
			.setThumbnail('https://i.redd.it/7ff02zhiuym61.jpg')
			.setFooter(`Created by ${admin.username}`)
			.setTimestamp()

		return embed
	}

  /**
	 * Send the id of channel.
	 * 
   * @param msg: the admin class of discord bot
   * @param args: the argments of the command
	 * @param info: the info config:
	 * 		-blank: True if it is a blank command
	 * @version: 2.0
	 * @author: Zhijie
	 */
  execute(msg, args, info){
		var mentions = [];

		// Add each user in the map
		for (var channel of msg.mentions.channels) {
			// channel[0] is the id, channel[1] is the obj
			var name = `${channel[1].name}: ${channel[0]}`
			mentions.push(name)
		}

    msg.channel.send(mentions);
  }
}