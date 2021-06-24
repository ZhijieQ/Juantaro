const commands = require('../../../commands.js')
const discord = require('discord.js')
const util = require("../../util")
const ytdl = require("ytdl-core")
const YouTube = require("simple-youtube-api")

const lang = util.getLanguage()
const config = util.getConfig()
const Credential = process.env["googleCredentials"]
const youtube = new YouTube(Credential)

module.exports = class PlayCommand extends commands.Command {
  constructor(){
    super({
      name: 'play',
      aliases: ['p', 'Play', 'P'],
      args: [
        new commands.Argument({
          optional: false,
          type: 'string',
          missingError: lang.error.noArgs.mention,
          invalidError: lang.error.incoArgs.text
        })
      ],
      category: 'music',
      priority: 5,
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
											'** is used to play music')
			.addField('Permission:', config.permission[this.permLvl])
			.addField('Prefix:', `${util.capitalize(config.prefix)}, ${config.prefix}`)
			.addField('Aliases:', this.aliases) 
			.addField('Argument:', '**-"String":** play the music indicate **composed String**.')
			.setThumbnail('https://i.redd.it/7ff02zhiuym61.jpg')
			.setFooter(`Created by ${admin.username}`)
			.setTimestamp()

		return embed
	}

	/**
	 * Take id information from guild and play the song.
	 * This is usefull if you have the bot in different server.	
	 * 
	 * @param guild: ther guild class from discord
	 * @param song: the name of the song
	 * @version: 1.0
	 * @author: Zhijie
	 */
	async play(guild, song) {
		// Get the queue from server.
		const serverQueue = await queue.get(guild.id)

		// If no song, finish then.
		if(!song) {
			// Wait for the bot to exit the voice channel
			await serverQueue.voiceChannel.leave();
			
			// Delete the queue from this server.
			await queue.delete(guild.id);
			return;
		}
		
		// Get the stream from youtube with url and aply a filter.
		const stream = await ytdl(song.url, {
			// Filter Audio Only
			filter: 'audioonly',
			// How much of the video download to buffer into memory.
			highWaterMark: 1 << 25,
			quality: "highestaudio"
		})

		// The dispatcher play to song.
		const dispatcher = await serverQueue.connection.play(stream)
			// Music finish event. Reproduce next song if has.
			.on('finish', async () => {
				// Eliminate the song that are reproducing
				serverQueue.songs.shift();

				// Always try to play first video of the queue
				play(guild, serverQueue.songs[0])
			})
			// Error event.
			.on('error', (error) => console.log(error));

		// Set audio volumen.
		dispatcher.setVolume(serverQueue.volume)

		return msg.channel.send(`Reproducing ${song.title}.`)
	}

  /**
	 * Play the music.
	 * 
   * @param msg: the admin class of discord bot
   * @param args: the argments of the command
	 * @param info: the info config:
	 * 		-blank: True if it is a blank command
	 * @version: 2.0
	 * @author: Zhijie
	 */
  async execute(msg, args, info){
		const queue = info['client'].queue

		// Check if bot is in the voice channel
		const voiceChannel = msg.member.voice.channel;
		if(!voiceChannel)
			return msg.channel.send('You should be connected in a voice channel.');

		msg.channel.send("Still working");
  }
}