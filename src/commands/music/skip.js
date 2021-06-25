const commands = require('../../../commands.js')

module.exports = class SkipCommand extends commands.Command {
  constructor() {
   super({
    name: 'skip',
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
											'** is used to skip the music with vote System.')
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
	 * Skip the music using vote System.
	 * 
   * @param msg: the admin class of discord bot
   * @param args: the argments of the command
	 * @param info: the info config:
	 * 		-blank: True if it is a blank command
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
		
		// If there is 2 members (bot + author) in the voice channel, dont need vote
		if(msg.member.voice.channel.members.size === 2) {
      await serverQueue.connection.dispatcher.end();
			msg.channel.send('The song being played was skipped.')
      return;
    }
		
		// Use for check user vote, only one vote/user
		const map = info['client'].skipvote;
		const listUser = map.get(msg.guild.id);
		const skipNumber = parseInt(msg.member.voice.channel.members.size / 2);

		// If there is a listUser, means the users are voting.
		if (listUser) {
			// If the listUser include the author, return a message because he/she has voted
      if (listUser.includes(msg.author.id)) return msg.reply('You have voted.');
			// Else, push this new user in the listUser.
      await listUser.push(msg.author.id)
      
      msg.channel.send(`${msg.author.username} has voted to skip current song. **${listUser.length}/${skipNumber}**`)

      if (listUser.length < skipNumber) return;
      
      await serverQueue.connection.dispatcher.end();

			return msg.channel.send('The current song has been skiped.');
    }
		// If there is not a listUser, you need initialize a new vote.
		else {
			// Use for prettier format
      const listUser = [];
      await map.set(msg.guild.id, listUser);
      await listUser.push(msg.author.id);

      let skipNumber = parseInt(msg.member.voice.channel.members.size / 2);

      return msg.channel.send(`**${msg.author.username}** started a new vote to skip the current song. It takes **${skipNumber}** votes to skip.`)
    }
  }
}