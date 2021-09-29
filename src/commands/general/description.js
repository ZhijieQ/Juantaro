const commands = require('../../../commands.js')
const discord = require('discord.js')
const util = require("../../util")
const lang = util.getLanguage()
const config = util.getConfig()

module.exports = class AvatarCommand extends commands.Command {
  constructor(){
    super({
      name: 'desc',
      aliases: ['description'],
      args: [
        new commands.Argument({
          optional: true,
					type: "mention",
          missingError: lang.error.noArgs.mention,
          invalidError: lang.error.incoArgs.text
        })
      ],
      category: 'general',
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
											'** is used to consult the description.')
			.addField('Permission:', config.permission[this.permLvl])
			.addField('Prefix:', `${util.capitalize(config.prefix)}, ${config.prefix}`)
			.addField('Aliases:', this.aliases) 
			.addField('Argument:', '**-None:** consult **_Author_** description.\n' +
														 '**-<_@someone_>:** consult **_@someone_** description.')
			.setThumbnail('https://i.redd.it/7ff02zhiuym61.jpg')
			.setFooter(`Created by ${admin.username}`)
			.setTimestamp()

		return embed
	}

  /**
	 * Send all description of the msg.author.
	 * 
   * @param msg: the admin class of discord bot
   * @param args: the argments of the command
	 * @param info: the info config for Music Module
	 * @version: 2.0
	 * @author: Zhijie
	 */
  execute(msg, args, info){
    let mentions = msg.mentions.users.first() || msg.author;
		//console.log(mentions)
    const embed = new discord.MessageEmbed()
		 .setTitle(mentions.username)
		 .addField('Discriminator', mentions.discriminator)
		 .addField('Bot', mentions.bot)
     .setImage(mentions.avatarURL())
     .setColor('RANDOM')
     .setFooter(`Avatar de ${mentions.tag}`)
		 .setTimestamp()
    msg.channel.send(embed);
  }
}