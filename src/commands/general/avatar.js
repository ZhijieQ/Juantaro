const commands = require('../../../commands.js')
const discord = require('discord.js');
const lang = require('../../util.js').getLanguage();

module.exports = class AvatarCommand extends commands.Command {
  constructor(){
    super({
      name: 'avatar',
      aliases: ['Avatar'],
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
    const embed = new discord.MessageEmbed()
     .setImage(mentions.avatarURL())
     .setColor('RANDOM')
     .setFooter(`Avatar de ${mentions.tag}`)   
    msg.channel.send(embed);
  }
}