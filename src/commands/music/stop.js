const commands = require('../../../commands.js')

module.exports = class StopCommand extends commands.Command {
  constructor() {
   super({
    name: 'stop',
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
											'** is used to stop the music.')
			.addField('Permission:', config.permission[this.permLvl])
			.addField('Prefix:', `${util.capitalize(config.prefix)}, ${config.prefix}`)
			.addField('Aliases:', this.aliases) 
			.addField('Argument:', '**-None:** stop the music.')
			.setThumbnail('https://i.redd.it/7ff02zhiuym61.jpg')
			.setFooter(`Created by ${admin.username}`)
			.setTimestamp()

		return embed
	}

	/**
	 * Stop the music.
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
		let guild = msg.guild;

		if(!msg.member.voice.channel)
			return msg.channel.send('You should be connected in a voice channel.')

		if(!serverQueue)
			return msg.channel.send('No song is playing.')
		
		serverQueue.songs = [];
		
		if(serverQueue.connection.dispatcher){
			await serverQueue.connection.dispatcher.end();
		}
		
		// Wait for the bot to exit the voice channel
		await serverQueue.voiceChannel.leave();
		
		// Delete the queue from this server.
		await queue.delete(guild.id);
		return msg.channel.send('Song Stoped.')
  }
}