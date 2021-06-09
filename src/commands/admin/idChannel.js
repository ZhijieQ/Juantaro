const commands = require('../../../commands.js')
const discord = require('discord.js')
const util = require("../../util")
const lang = util.getLanguage()
const config = util.getConfig()

module.exports = class IdChannelCommand extends commands.Command {
  constructor(){
    super({
      name: 'idC',
      aliases: ['idChannel', 'idchannel', 'IdChannel', 'Idchannel'],
      args: [
        new commands.Argument({
          optional: true,
          type: 'channel',
          missingError: lang.error.noArgs.mention,
          invalidError: lang.error.incoArgs.text
        })
      ],
      category: 'test',
      priority: 0,
      permLvl: 3
    });
  }

	specificHelp(admin){
		const embed = new discord.MessageEmbed()
			.setTitle(`${util.capitalize(this.name)}`)
			.setColor('YELLOW')
			.setDescription(`The command **${this.name}` + 
											'** is use for get the Id of the **Channel**')
			.addField('Permission:', config.permission[this.permLvl])
			.addField('Prefix:', `${util.capitalize(config.prefix)}, ${config.prefix}`)
			.addField('Aliases:', this.aliases) 
			.addField('Argument:', '**-None:** get Id of this channel.\n' +
														 '**-#channel:** get Id of **#channel**.')
			.setThumbnail('https://i.redd.it/7ff02zhiuym61.jpg')
			.setFooter(`Created by ${admin.username}`)
			.setTimestamp()

		return embed
	}

  execute(msg, args){
		//console.log(msg.channel)
    let mentions = msg.channel;
    
    msg.channel.send(mentions.id);
  }
}