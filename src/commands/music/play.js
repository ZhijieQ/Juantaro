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
      priority: 7,
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
		const queue = info['client'].queue;
		let guild = msg.guild;
		//const map = info['client'].skipvote;

		// Check if bot is in the voice channel
		const voiceChannel = msg.member.voice.channel;
		if(!voiceChannel)
			return msg.channel.send('You should be connected in a voice channel.');
		
		/**
		 * Take id information from guild and play the song.
		 * This is usefull if you have the bot in different server.	
		 * 
		 * @param guild: the guild class from discord
		 * @param song: the name of the song
		 * @version: 1.0
		 * @author: Zhijie
		 */
		async function play(guild, song) {
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

			/*console.log("B:")
			console.log(song.url)
			console.log(stream)
			console.log(serverQueue.connection)
			console.log(serverQueue)*/
			//console.log(stream)

			// The dispatcher play to song.
			var dispatcher = await serverQueue.connection.play(stream)
				// Music finish event. Reproduce next song if has.
				.on('finish', async () => {
					// Eliminate the song that are reproducing
					serverQueue.songs.shift();

					//await map.delete(guild.id);
					// Always try to play first video of the queue
					await play(guild, serverQueue.songs[0])
				})
				// Error event.
				.on('error', (error) => console.log(error));

			// Set audio volumen.
			dispatcher.setVolume(serverQueue.volume);
			//console.log(dispatcher)

			let durationSeconds = song.duration.seconds < 9 ? '0' + song.duration.seconds : song.duration.seconds;
			let durationMinutes = song.duration.minutes < 9 ? '0' + song.duration.minutes : song.duration.minutes;
			let durationHours = song.duration.hours < 9 ? '0' + song.duration.hours : song.duration.hours;
			const embedSong = new discord.MessageEmbed()
				.setTitle(song.title)
				.setColor("RANDOM")
				.setThumbnail(song.thumbnail)
				.setDescription(`Duración: **${durationHours}:${durationMinutes}:${durationSeconds}**`)
				.setURL(song.url)
				.setFooter(song.publish);

			return msg.channel.send(`Reproducing now:`, {embed: embedSong})
		}

		/**
		 * Control the video of the song.
		 * 
		 * @param video: the video that will be convert into audio
		 * @param playlist: the reproductor or playlist
		 * @version: 1.0
		 * @author: Zhijie
		 */
		async function handleVideo(video, playlist) {
			const serverQueue = await queue.get(guild.id);
			const song = {
				title: video.title,
				id: video.id,
				duration: video.duration,
				publish: video.publishedAt,
				thumbnail: video.thumbnails.default.url,
				url: `https://www.youtube.com/watch?v=${video.id}`
			}

			// If there is a queue, add the song into it
			if (serverQueue) {
				await serverQueue.songs.push(song);

				// Use if there is a reproductor or playing
				// We dont have it, so return it
				// !TODO: implementar esto para escoger que cancion reproducir primero
				if(playlist)
					return;
				
				let durationSeconds = song.duration.seconds < 9 ? '0' + song.duration.seconds : song.duration.seconds;
				let durationMinutes = song.duration.minutes < 9 ? '0'+song.duration.minutes : song.duration.minutes;
				let durationHours = song.duration.hours < 9 ? '0' + song.duration.hours : song.duration.hours;

				const embedQueue = new discord.MessageEmbed()
					.setTitle(song.title)
					.setColor("RANDOM")
					.setThumbnail(song.thumbnail)
					.setDescription(`Duración: **${durationHours}:${durationMinutes}:${durationSeconds}**`)
					.setURL(song.url)
					.setFooter(song.publish);

				return msg.channel.send('Song add into Queue: ', { embed: embedQueue });
			}
			// If there is not a queue, create it
			else{
				const queueConstruct = {
					textChannel: msg.channel,
					voiceChannel,
					connection: null, // For discord voice channel
					songs:[],
					playing: true,
					volume: 1
				}

				try {
					// Push the song
					await queueConstruct.songs.push(song)

					// Make bot join into channel
					const connection = await voiceChannel.join();
					queueConstruct.connection = connection;

					// Create the queue with guild Id
					await queue.set(guild.id, queueConstruct)

					// Now, we start playing the music
					await play(guild, queueConstruct.songs[0])
				} catch (error) {
					msg.channel.send('There was a playback error, ask @!322787975630946306 to check pls.')
				}
			}
		}

		// Start processing the request
		let video;

		// Check if args[0] is a URL
		if (ytdl.validateURL(args[0])) {
			video = await youtube.getVideo(args[0])
		}
		// If not, find possible URL from args[0]
		else {
			let song = args.join(" ");

			try {
				let videos = await youtube.searchVideos(song, 10)
				if (!videos.length) return msg.channel.send('No se encontraron resultados de busqueda, pruebe enviando el enlace de Youtube')
				let index = 0
				const embed = new discord.MessageEmbed()
				.setDescription(`${videos.map((video) => `**${++index}** - ${video.title}`).join('\n')}`)
				.setColor('RANDOM')

				msg.channel.send(embed)
				let optionSearch;

				try {
					optionSearch = await msg.channel.awaitMessages((msg2) => msg2.content > 0 && msg2.content < 11 && msg.author.id === msg2.author.id, {
						max: 1,
						time: 30000,
						errors: ['time']
					});
				} catch (error) {
					return msg.channel.send('La opción de busqueda se ha cancelado.')
				}

				const videoIndex = parseInt(optionSearch.first().content, 10)
    		video = await youtube.getVideoByID(videos[videoIndex - 1].id)
			} catch (error) {
				return msg.channel.send('Hubo un error en la busqueda de resultados.')
			}
		}

		handleVideo(video, false);
  }
}