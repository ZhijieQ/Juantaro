const commands = require('../commands.js');
const db = require('../src/database/db.js');
const util = require('../src/util.js');

const config = util.getConfig();
let startTime = Date.now();

module.exports = async (client) => {
  // Set bot Status (online, idle, invisible, dnd)
	client.user.setStatus(config.status['online'])

	// Set bot activity
	client.user.setActivity(config.statusBOT);

	// Register the category from config.js
 	commands.registerCategories(config.categories);

	// Register all command from ./src/commands/
 	commands.registerCommands();

	// Create coins Table if not exists
	await db.coinSystem.check.createTables();

 	let time = Date.now() - startTime;
	console.log(`Logged in as ${client.user.tag}! Used Time: ${time}ms`);

	//const testChannel = client.channels.find(x => x.name === 'test')
	//console.log(testChannel)
}