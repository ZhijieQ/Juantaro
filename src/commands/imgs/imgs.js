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
      aliases: ['Img', 'imgs'],
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
			.addField('Argument:', '**-String:** search the **String** image.\n' +
														 '**-"String":** search the **String** image if the Strings are composed.\n' +
														 '**-String/"String Number":** search the **index Number** image.')
			.setThumbnail('https://i.redd.it/7ff02zhiuym61.jpg')
			.setFooter(`Created by ${admin.username}`)
			.setTimestamp()

		return embed
	}

	execute(msg, args){
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
					msg.channel.send('Sorry, this image does not exists!');
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