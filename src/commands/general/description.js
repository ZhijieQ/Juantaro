const commands = require('../../../commands.js')
const discord = require('discord.js');
const lang = require('../../util.js').getLanguage();

module.exports = class AvatarCommand extends commands.Command {
  constructor(){
    super({
      name: 'desc',
      aliases: ['Desc', 'descrip', 'Descrip', 'description', 'Description'],
      args: [
        new commands.Argument({
          optional: true,
					type: "string",
          missingError: lang.error.noArgs.mention,
          invalidError: lang.error.incoArgs.text
        })
      ],
      category: 'general',
      priority: 9,
      permLvl: 0
    });
  }
  execute(msg, args){
    let mentions = msg.mentions.users.first() || msg.author;
		console.log(mentions)
    const embed = new discord.MessageEmbed()
		 .setTitle(mentions.username)
		 .addField('Discriminator', mentions.discriminator)
		 .addField('Bot', mentions.bot)
     .setImage(mentions.avatarURL())
     .setColor('GREEN')
     .setFooter(`Avatar de ${mentions.tag}`)
		 .setTimestamp()
    msg.channel.send(embed);
  }
}