const commands = require('../../../commands.js')
const discord = require('discord.js')
const util = require("../../util")
const lang = util.getLanguage()
const config = util.getConfig()

module.exports = class IdCommand extends commands.Command {
  constructor(){
    super({
      name: 'id',
      aliases: ['Id', 'idMember', 'idmember'],
      args: [
        new commands.Argument({
          optional: false,
          type: 'mention',
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
											'** is use for get the Id of the **User**')
			.addField('Permission:', config.permission[this.permLvl])
			.addField('Prefix:', `${util.capitalize(config.prefix)}, ${config.prefix}`)
			.addField('Aliases:', this.aliases) 
			.addField('Argument:', '**-None:** get **Author Id **.\n' +
														 '**-@someon:** get Id of **@someone**.')
			.setThumbnail('https://i.redd.it/7ff02zhiuym61.jpg')
			.setFooter(`Created by ${admin.username}`)
			.setTimestamp()

		return embed
	}

  	/**
	 * Send the id of user.
	 * 
     * @param msg: the admin class of discord bot
     * @param args: the argments of the command
	 * @version: 1.0
	 * @author: Zhijie
	 */
  execute(msg, args){
		var mentions = [];

		// Add each user in the map
		for (var user of msg.mentions.users) {
			// user[0] is the id, user[1] is the obj
			var name = `${user[1].username}: ${user[0]}`
			mentions.push(name)
		}

    msg.channel.send(mentions);
  }
}