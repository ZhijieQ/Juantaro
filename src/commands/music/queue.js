const commands = require('../../../commands.js')

module.exports = class QueueCommand extends commands.Command {
  constructor() {
   super({
    name: 'queue',
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
											'** is used to list all queue music.')
			.addField('Permission:', config.permission[this.permLvl])
			.addField('Prefix:', `${util.capitalize(config.prefix)}, ${config.prefix}`)
			.addField('Aliases:', this.aliases) 
			.addField('Argument:', '**-None:** list all queue music.')
			.setThumbnail('https://i.redd.it/7ff02zhiuym61.jpg')
			.setFooter(`Created by ${admin.username}`)
			.setTimestamp()

		return embed
	}

	/**
	 * List all queue music.
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
		
		const queueSongs = serverQueue.songs;

		// Changing informations to Sring format
		let listSongs = queueSongs.slice(1, 10).map(song => {
			let durationSeconds = song.duration.seconds < 9 ? '0' + song.duration.seconds : song.duration.seconds;
			let durationMinutes = song.duration.minutes < 9 ? '0' + song.duration.minutes : song.duration.minutes;
			let durationHours = song.duration.hours < 9 ? '0' + song.duration.hours : song.duration.hours;

			return `**=>** ${song.title} - **__${durationHours}:${durationMinutes}:${durationSeconds}__**`;
		})

		const queueEmbed = new discord.MessageEmbed()
			.setColor('RANDOM')
			.setThumbnail(queueSongs[0].thumbnail)
			.setDescription(`Reproducing Now:\n**${queueSongs[0].title}**\n\n========================\n${listSongs.join('\n')}`)

    return msg.channel.send('Server song list **__'+ msg.guild.name + '__**', {embed: queueEmbed})
  }
}