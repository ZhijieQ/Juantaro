/**
 * Get config setting.
 * 
 * @return: the require of config.js
 * @version: 1.0
 * @author: Zhijie
 */
function getConfig() {
  return require('../config.js')
}

/**
 * Get Language setting.
 * This function read language name from config.js and
 * get the correct file form languages dir.
 * 
 * @return: the require of language.json
 * @version: 1.0
 * @author: Zhijie
 */
function getLanguage() {
	const config = getConfig();
	const language = config.language.toLocaleLowerCase();
	var lang;
	if (language === "english") {
		lang = require("../languages/EN-en.json");
	}else if(language === "spanish"){
		lang = require("../languages/ES-es.json")
	}
  return lang;
}

/**
 * Send the massage to channel.
 * 
 * @param msg: the massage class from discord.js
 * @param text: the text that want to send
 * @version: 1.0
 * @author: Zhijie
 */
function send(msg, text) {
	msg.channel.send(text)
}

/**
 * Capitalize the sentence.
 * 
 * @param sentence: the sentence to capitalize
 * @return: the sentence changed
 * @version: 1.0
 * @author: Zhijie
 */
function capitalize(sentence){
		return sentence[0].toUpperCase() + sentence.slice(1)
	}

/**
 * Get user from mentions of the message.
 * 
 * @param msg: the massage class from discord.js
 * @return users: the list of the users 
 * @version: 1.0
 * @author: Zhijie
 */
async function getUsers(msg) {
	users = msg.mentions.users
	/*const id = users.forEach( (value, key) => {
		if (users.get(value)["username"] === "Pedro123")
	})
	console.log(users.get("433633517902102537")["username"])*/
	return users
}

module.exports = {
	getConfig,
	send,
	getLanguage,
	getUsers,
	capitalize
}
