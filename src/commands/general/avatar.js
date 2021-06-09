const commands = require('../../../commands.js')
const discord = require('discord.js')
const util = require("../../util")
const lang = util.getLanguage()
const config = util.getConfig()

module.exports = class AvatarCommand extends commands.Command {
  constructor(){
    super({
      name: 'avatar',
      aliases: ['Avatar'],
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

	specificHelp(admin){
		const embed = new discord.MessageEmbed()
			.setTitle(`${util.capitalize(this.name)}`)
			.setColor('YELLOW')
			.setDescription(`The command **${this.name}` + 
											'** is use for consult the avatar.')
			.addField('Permission:', config.permission[this.permLvl])
			.addField('Prefix:', `${util.capitalize(config.prefix)}, ${config.prefix}`)
			.addField('Aliases:', this.aliases) 
			.addField('Argument:', '**-None:** consult **Author** avatar.\n' +
														 '**-@someone:** consult **@someone** avatar.')
			.setThumbnail('https://i.redd.it/7ff02zhiuym61.jpg')
			.setFooter(`Created by ${admin.username}`)
			.setTimestamp()

		return embed
	}

  execute(msg, args){
    let mentions = msg.mentions.users.first() || msg.author;
    const embed = new discord.MessageEmbed()
     .setImage(mentions.avatarURL())
     .setColor('RANDOM')
     .setFooter(`Avatar de ${mentions.tag}`)   
    msg.channel.send(embed);
  }
}