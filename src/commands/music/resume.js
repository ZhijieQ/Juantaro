const commands = require('../../../commands.js')

module.exports = class ResumeCommand extends commands.Command {
  constructor() {
   super({
    name: 'resume',
    aliases: [],
		args: [],
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
											'** is used to resume the music.')
			.addField('Permission:', config.permission[this.permLvl])
			.addField('Prefix:', `${util.capitalize(config.prefix)}, ${config.prefix}`)
			.addField('Aliases:', this.aliases) 
			.addField('Argument:', '**-None:** resume the music.')
			.setThumbnail('https://i.redd.it/7ff02zhiuym61.jpg')
			.setFooter(`Created by ${admin.username}`)
			.setTimestamp()

		return embed
	}

	/**
	 * Resume the music.
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

		if(!msg.member.voice.channel)
			return msg.channel.send('You should be connected in a voice channel.')

		if(!serverQueue)
			return msg.channel.send('No song is playing.')
		
		if(serverQueue && !serverQueue.playing) {
			serverQueue.playing = true;
			//console.log('En pausa');
			serverQueue.connection.dispatcher.resume();

			return msg.channel.send('Song Resumed.');
		}else{
			return msg.channel.send('The song is playing.')
		}
  }
}