const { Client } = require("discord.js")
const server = require("./src/server")
const fs = require('fs')
const client = new Client()
const TOKEN = process.env["TOKEN"]

/* Config Music */
client.queue = new Map();
client.skipvote = new Map();

// Iterate all file from events dir
for (let file of fs.readdirSync("./events/")) {
	// Get file ending with .js
	if(file.endsWith(".js")) {
		// Get the name of the file
		let fileName = file.substring(0, file.length - 3)
		
		// Require it
		let fileContents = require(`./events/${file}`);

		// Set the event to client after bind
		client.on(fileName, fileContents.bind(null, client));

		// !TODO: esta linea de abajo no funcciona
		//delete require.cache[require.resolve(`./events/${file}`)];
	}
}

// Open a port to the server
server.keepAlive()

// Login the bot
client.login(TOKEN).catch((err) => {
	console.error(err);
  process.exitCode = 1;
  process.exit();
})
