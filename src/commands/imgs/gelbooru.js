const commands = require('../../../commands.js')
const discord = require('discord.js')
const util = require("../../util")
const lang = util.getLanguage()
const config = util.getConfig()
const axios = require('axios')
var DomParser = require('dom-parser');
var parser = new DomParser();
const fetch = require('node-fetch');
const booru = require('booru');
const { Client, MessageEmbed } = require('discord.js');
/*var jsdom = require("jsdom");
var JSDOM = jsdom.JSDOM;
const https = require('https')*/

module.exports = class GelbooruCommand extends commands.Command {
  constructor(){
    super({
      name: 'gelbooru',
      aliases: ['Gelbooru'],
      args: [
        new commands.Argument({
          optional: false,
					type: "string",
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
											'** is used to search image.')
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

   run(message) {
        var errMessage = errors[Math.round(Math.random() * (errors.length - 1))];
        var query = message.content.split(/\s+/g).slice(1).join(" ");

        booru.search('gelbooru', [query], { limit: 1, random: true })
            .then(booru.commonfy)
            .then(images => {
                for (let image of images) {
                    const embed = new Discord.MessageEmbed()
                        .setAuthor(`gelbooru ${query}`, 'https://cure.ninja/booru/api/json/url/?url=http%3A%2F%2Fdonmai.us%2Fdata%2Feae4828342217c4498d6d9831a4558ca.jpg')
                        .setDescription(`[Image URL](${image.common.file_url})`)
                        .setImage(image.common.file_url)
                    return message.channel.send({ embed });
                }
            }).catch(err => {
                if (err.name === 'booruError') {
                    return message.channel.send(`No results found for **${query}**!`);
                } else {
                    return message.channel.send(`No results found for **${query}**!`);
                }
            })
    }
}