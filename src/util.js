function getConfig() {
  return require('../config.js')
}

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

function send(msg, text) {
	msg.channel.send(text)
}

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
	getUsers
}
