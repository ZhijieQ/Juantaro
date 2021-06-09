const commands = require('../../../commands.js')
const discord = require('discord.js')
const util = require("../../util")
const lang = util.getLanguage()
const config = util.getConfig()
const axios = require('axios')
var DomParser = require('dom-parser');
var parser = new DomParser();
const fetch = require('node-fetch');
/*var jsdom = require("jsdom");
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

	specificHelp(admin){
		const embed = new discord.MessageEmbed()
			.setTitle(`${util.capitalize(this.name)}`)
			.setColor('YELLOW')
			.setDescription(`The command **${this.name}` + 
											'** is use for search image.')
			.addField('Permission:', config.permission[this.permLvl])
			.addField('Prefix:', `${util.capitalize(config.prefix)}, ${config.prefix}`)
			.addField('Aliases:', this.aliases) 
			.addField('Argument:', '**-String:** search the **String** image.\n')
			.setThumbnail('https://i.redd.it/7ff02zhiuym61.jpg')
			.setFooter(`Created by ${admin.username}`)
			.setTimestamp()

		return embed
	}

	async postData(url = '', data = {}) {
		// Opciones por defecto estan marcadas con un *
		const response = await fetch(url, {
			method: 'POST', // *GET, POST, PUT, DELETE, etc.
			mode: 'cors', // no-cors, *cors, same-origin
			cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
			credentials: 'same-origin', // include, *same-origin, omit
			headers: {
				'Content-Type': 'application/json'
				// 'Content-Type': 'application/x-www-form-urlencoded',
			},
			redirect: 'follow', // manual, *follow, error
			referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
			body: JSON.stringify(data) // body data type must match "Content-Type" header
		});
		console.log(response.json())
		return response.json(); // parses JSON response into native JavaScript objects
	}

  execute(msg, args){
		console.log(args)

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