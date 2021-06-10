const commands = require('../../../commands.js')
const discord = require('discord.js')
const util = require("../../util")
const lang = util.getLanguage()
const config = util.getConfig()
var gis = require('g-i-s');
const axios = require('axios')
var DomParser = require('dom-parser');
var parser = new DomParser();
const fetch = require('node-fetch');
/*var jsdom = require("jsdom");
var JSDOM = jsdom.JSDOM;
const https = require('https')*/

module.exports = class ImgsCommand extends commands.Command {
  constructor(){
    super({
      name: 'img',
      aliases: ['Img', 'imgs'],
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
											'** is use for search image in google.')
			.addField('Permission:', config.permission[this.permLvl])
			.addField('Prefix:', `${util.capitalize(config.prefix)}, ${config.prefix}`)
			.addField('Aliases:', this.aliases) 
			.addField('Argument:', '**-String:** search the **String** image.\n')
			.setThumbnail('https://i.redd.it/7ff02zhiuym61.jpg')
			.setFooter(`Created by ${admin.username}`)
			.setTimestamp()

		return embed
	}

	execute(msg, args){
		console.log(args)
		var opts = {
			searchTerm: 'gato negro',
			/*queryStringAddition: '&tbs=ic:trans',
			filterOutDomains: [
				'pinterest.com',
				'deviantart.com'
			]*/
		};
		function logResults(error, results) {
			if (error) {
				console.log(error);
			}
			else {
				const file = JSON.parse(JSON.stringify(results, null, '  '))
				//console.log(file[1]['url']);
				msg.channel.send(file[1]['url']);
			}
		}
		gis(opts, logResults);
  }

  /*execute(msg, args){
		console.log(args)

		const url = `http://www.google.com/search?q=${args.join("+")}&tbm=isch`
		//console.log(url)
    axios
			.get(url)
			.then(res => {
				const dom = parser.parseFromString(res.data);
				
				//console.log(dom)
				//console.log(dom)
				const article = dom.getElementsByClassName('RAyV4b')[2]
				console.log(article.innerHTML)
				if(!article){
					msg.channel.send("Sorry, this image does not exists!");
				}
				const url = article.innerHTML.split('src="')[1].split('"')[0]
				//console.log(url)
				msg.channel.send(url);
				//console.log(fixUrl)
				//console.log(res.data)
			})
			.catch(error => {
				console.error(error)
			})
	}*/
}