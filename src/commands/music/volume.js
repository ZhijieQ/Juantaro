const commands = require('../../../commands.js')
const util = require("../../util")
const lang = util.getLanguage()

module.exports = class VolumeCommand extends commands.Command {
  constructor() {
   super({
    name: 'volume',
    aliases: [],
		args: [
			 new commands.Argument({
          optional: false,
          type: 'number',
          missingError: lang.error.noArgs.mention,
          invalidError: lang.error.incoArgs.text
        })
		],
    category: 'music',
    priority: 7,
    permLvl: 0
   })
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
											'** is used to set the volume of the bot.')
			.addField('Permission:', config.permission[this.permLvl])
			.addField('Prefix:', `${util.capitalize(config.prefix)}, ${config.prefix}`)
			.addField('Aliases:', this.aliases) 
			.addField('Argument:', '**-__Number__:** this valor should be between **__0-2__**.')
			.setThumbnail('https://i.redd.it/7ff02zhiuym61.jpg')
			.setFooter(`Created by ${admin.username}`)
			.setTimestamp()

		return embed
	}

	/**
	 * Set the volume of the bot.
	 * 
   * @param msg: the admin class of discord bot
   * @param args: the argments of the command
	 * @param info: the info config for Music Module
	 * @version: 1.0
	 * @author: Zhijie
	 */
  async execute(msg, args, info) {
		const queue = info['client'].queue;
		const serverQueue = queue.get(msg.guild.id);
		const volume = Number(args[0])

		if(!msg.member.voice.channel)
			return msg.channel.send('You should be connected in a voice channel.')

		if(!serverQueue)
			return msg.channel.send('No song is playing.')
		
		if(volume > 2 || volume < 0) return msg.channel.send('The volume valor should be between 0-2');

		serverQueue.volume = volume;
  	serverQueue.connection.dispatcher.setVolume(volume)

		return msg.channel.send(`The bot volume is set to **${volume}**.`)
  }
}