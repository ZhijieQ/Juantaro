const commands = require('../../../commands.js')
const discord = require('discord.js')
const util = require("../../util")
const lang = util.getLanguage()
const config = util.getConfig()
const axios = require('axios')
/*var DomParser = require('dom-parser');
var parser = new DomParser();
const fetch = require('node-fetch');
var jsdom = require("jsdom");
var JSDOM = jsdom.JSDOM;
const https = require('https')*/

module.exports = class AvatarCommand extends commands.Command {
  constructor(){
    super({
      name: 'search',
      aliases: ['Search'],
      args: [
        new commands.Argument({
          optional: false,
					type: "string",
          missingError: lang.error.noArgs.mention,
          invalidError: lang.error.incoArgs.text
        })
      ],
      category: 'general',
      priority: 9,
      permLvl: 1
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
											'** is used to search image in google.')
			.addField('Permission:', config.permission[this.permLvl])
			.addField('Prefix:', `${util.capitalize(config.prefix)}, ${config.prefix}`)
			.addField('Aliases:', this.aliases) 
			.addField('Argument:', '**-String:** search the **String** image.\n')
			.setThumbnail('https://i.redd.it/7ff02zhiuym61.jpg')
			.setFooter(`Created by ${admin.username}`)
			.setTimestamp()

		return embed
	}

	/**
	 * Send the result of google search.
	 * !TODO: not finish.
	 * 
   * @param msg: the admin class of discord bot
   * @param args: the argments of the command
	 * @param info: the info config:
	 * 		-blank: True if it is a blank command
	 * @version: 2.0
	 * @author: Zhijie
	 */
  execute(msg, args, info){
		//console.log(args)

		var url = `http://www.google.com/search?q=${args.join("+")}&tbm=isch`
    axios
			.get(url)
			.then(res => {
				var dom = parser.parseFromString(res.data);
				console.log(dom)
				//console.log(dom)
				/*var article = dom.getElementsByClassName('thumbnail-preview')[0]
				console.log(article)
				if(!article){
					msg.channel.send("Sorry, this image does not exists!");
				}
				var brokeUrl = article.innerHTML.split('href="')[1].split('">')[0]
				
				var sentences = brokeUrl.split('amp;')
				var fixUrl = sentences.join('')
				console.log(fixUrl)
				msg.channel.send(fixUrl);*/
				msg.channel.send("Hello")
				//console.log(fixUrl)
				//console.log(res.data)
			})
			.catch(error => {
				console.error(error)
			}) 
  }
}