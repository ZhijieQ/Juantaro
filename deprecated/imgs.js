const commands = require('../../../commands.js')
const discord = require('discord.js')
const util = require("../../util")
const lang = util.getLanguage()
const config = util.getConfig()
var gis = require('g-i-s');
/*const axios = require('axios')
var DomParser = require('dom-parser');
var parser = new DomParser();*/

module.exports = class ImgsCommand extends commands.Command {
  constructor(){
    super({
      name: 'img',
      aliases: ['imgs'],
      args: [
        new commands.Argument({
          optional: false,
					type: "string",
          missingError: lang.error.noArgs.mention,
          invalidError: lang.error.incoArgs.text
        }),
				new commands.Argument({
          optional: true,
					type: "number",
          missingError: lang.error.noArgs.mention,
          invalidError: lang.error.incoArgs.text
        })
      ],
      category: 'imgs',
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
			.addField('Argument:', '**-__String__:** search the **__String__** image.\n' +
														 '**-__"String"__:** search the **__String__** image if the Strings are composed.\n' +
														 '**-__String/"String__" Number:** search the **__index Number__** image with **__String__** composed.')
			.setThumbnail('https://i.redd.it/7ff02zhiuym61.jpg')
			.setFooter(`Created by ${admin.username}`)
			.setTimestamp()

		return embed
	}
	
	/**
	 * Send the imgs after search in google images.
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
	  gis(args[0], (error, results) => {
			// If error, return
			if(error){
				msg.channel.send('Sorry, this image does not exists!');
				return
			}
			//console.log(results)
			
			// If has the number argument, get this result
			if(args[1]){
				var result = results[Number(args[1])]
				if (result){
					msg.channel.send(result['url']);
				}else{
					msg.channel.send('Sorry, maybe you are using incorrect command, pls use **help img** to check!');
				}
			}
			// If has not the number argument, get first result
			else{
				if (results[1]){
					msg.channel.send(results[1]['url']);
				}else{
					msg.channel.send('Sorry, this image does not exists!');
				}
			}
			return
		});
	}
}

/*execute(msg, args){
		// Use for google image option
		const opts = {
			searchTerm: args[0].split(' ').join('+'),
			queryStringAddition: '&tbs=ic:trans',
			// Use to filter the page to get the image
			filterOutDomains: [
			]
		};

		gis(opts, (error, results) => {
			// If error, return
			if(error){
				msg.channel.send('Sorry, this image does not exists!');
				return
			}
			
			// If has the number argument, get this result
			if(args[1]){
				const result = results[args[1]]
				if (result){
					msg.channel.send(result['url']);
				}else{
					msg.channel.send('Sorry, this image does not exists!');
					return
				}
			}
			// If has not the number argument, get first result
			else{
				msg.channel.send(results[0]['url']);
			}
		});
	}*/

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