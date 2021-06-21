const commands = require('../../../commands.js')
const discord = require('discord.js')
const util = require("../../util")
const lang = util.getLanguage()
const config = util.getConfig()

module.exports = class ClearCommand extends commands.Command {
  constructor(){
    super({
      name: 'clear',
      aliases: ['Clear', 'clean', 'Clean'],
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

	specificHelp(admin){
		const embed = new discord.MessageEmbed()
			.setTitle(`${util.capitalize(this.name)}`)
			.setColor('YELLOW')
			.setDescription(`The command **${this.name}` + 
											'** is use for clean the message.')
			.addField('Permission:', config.permission[this.permLvl])
			.addField('Prefix:', `None`)
			.addField('Aliases:', this.aliases)
			.addField('Argument:', '**-None:** clean 100 message.\n' +
														 '**-Number:** clean number message.')
			.setThumbnail('https://i.redd.it/7ff02zhiuym61.jpg')
			.setFooter(`Created by ${admin.username}`)
			.setTimestamp()

		return embed
	}

  execute(msg, args){
		const number = Number(args[0])
		var maxNumber;
    if(!number){
			maxNumber = 100
		}else{
			maxNumber = Math.min(number+1, 100)
		}
		msg.channel.bulkDelete(maxNumber)
					.then(messages => console.log(`Bulk deleted ${messages.size} messages`))
					.catch(console.error);
  }
}