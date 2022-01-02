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
      name: 'playE',
      aliases: ['pE'],
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
											'** is like *_j-play_* but there will be a selecting list.')
			.addField('Permission:', config.permission[this.permLvl])
			.addField('Prefix:', `${util.capitalize(config.prefix)}, ${config.prefix}`)
			.addField('Aliases:', this.aliases) 
			.addField('Argument:', '**-<_String_>:** play the music indicating the **_String_**.\n' +
														 '**-<_URL_>:** play the music indicating the **_URL_**')
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
	 * @param info: the info config for Music Module
	 * @version: 1.0
	 * @author: Zhijie
	 */
  async execute(msg, args, info){
		const queue = info['client'].queue;
		let guild = msg.guild;
		const map = info['client'].skipvote;

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

			// The dispatcher play to song.
			var dispatcher = await serverQueue.connection.play(stream)
				// Music finish event. Reproduce next song if has.
				.on('finish', async () => {
					// Eliminate the song that are reproducing
					serverQueue.songs.shift();

					// Delete this song skipvote
					await map.delete(guild.id);

					// Always try to play first video of the queue
					await play(guild, serverQueue.songs[0])
				})
				// Error event.
				.on('error', (error) => {
					console.log(error)
					if(error.statusCode == 410){
						msg.channel.send("This music has age restriction.")
					}else if(error.statusCode == 429){
						msg.channel.send("Juantaro is get banned 😭.")
					}else{
						msg.channel.send("Can't find the audio for this song.")
					}

					// Wait for the bot to exit the voice channel
					serverQueue.voiceChannel.leave();
					
					// Delete the queue from this server.
					queue.delete(guild.id);
				});

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
					volume: 0.5
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
					msg.channel.send('There was a playback error, ask <@!322787975630946306> to check pls.')
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
				// Search a list of valiable videos
				let videos = await youtube.searchVideos(song, 10)

				// If there is no video, send a infor message
				if (!videos.length) return msg.channel.send('No search results found, try submitting the Youtube link.')
				
				// Making infor message
				let index = 0
				const embed = new discord.MessageEmbed()
					.setDescription(`${videos.map((video) => `**${++index}** - ${video.title}`).join('\n')}`)
					.setColor('RANDOM')

				msg.channel.send(embed).then(msg => setTimeout(() => msg.delete(), 30000)).catch(console.log('Message eliminated.'));

				let optionSearch;
				// Ask author what video want to reproduce
				try {
					optionSearch = await msg.channel.awaitMessages((msg2) => msg2.content > 0 && msg2.content < 11 && msg.author.id === msg2.author.id, {
						max: 1,
						time: 30000,
						errors: ['time']
					});

					/* Delete the embed message and the optionSearch */
					msg.channel.bulkDelete(2)
				} catch (error) {
					return msg.channel.send('The search option is cancelled.')
				}

				// Parser the content. Use base 10
				const videoIndex = parseInt(optionSearch.first().content, 10);

				// Get video with index
    		video = await youtube.getVideoByID(videos[videoIndex - 1].id);
			} catch (error) {
				return msg.channel.send('There was an error in the search results.')
			}
		}

		handleVideo(video, false);
  }
}