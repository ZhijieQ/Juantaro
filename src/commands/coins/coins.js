const { Command } = require('../../../commands.js')
const db = require('../../database/db.js');

module.exports = class CoinsCommand extends Command {
  constructor(){
    super({
      name: 'coins',
      aliases: [],
			args : [],
      category: 'coins',
      priority: 9,
      permLvl: 0
    });
  }
  /**
	 * Send the number of coins that have the msg.author.
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
											'** is used to consult the coins.')
			.addField('Permission:', config.permission[this.permLvl])
			.addField('Prefix:', `${util.capitalize(config.prefix)}, ${config.prefix}`)
			.addField('Aliases:', this.aliases) 
			.addField('Argument:', '**-None:** consult **Author** avatar.\n')
			.setThumbnail('https://i.redd.it/7ff02zhiuym61.jpg')
			.setFooter(`Created by ${admin.username}`)
			.setTimestamp()

		return embed
	}

  /**
	 * Send the number of coins that have msg.author.
	 * 
   * @param msg: the admin class of discord bot
   * @param args: the argments of the command
	 * @param info: the info config for Music Module
	 * @version: 2.0
	 * @author: Zhijie
	 */
  async execute(msg, args, info){
    let data = await db.coinSystem.coins.viewMember(msg.author.id);

    if(data){
      msg.channel.send(`Tienes **${data.coins} monedas**.`)
    } else {
      
      await db.coinSystem.coins.addMember(msg.author.id, 10, 0)
      
      let data = await db.coinSystem.coins.viewMember(msg.author.id);
      msg.channel.send(`Tienes **${data.coins} monedas**.`)
    }

  }
}