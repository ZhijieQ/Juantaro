const commands = require('../../../commands.js')
const lang = require('../../util.js').getLanguage();

module.exports = class IdCommand extends commands.Command {
  constructor(){
    super({
      name: 'id',
      aliases: ['Id', 'idMember', 'idmember'],
      args: [
        new commands.Argument({
          optional: false,
          type: 'mention',
          missingError: lang.error.noArgs.mention,
          invalidError: lang.error.incoArgs.text
        })
      ],
      category: 'admin',
      priority: 0,
      permLvl: 3
    });
  }
  execute(msg, args){
		var mentions = [];

		// Add each user in the map
		for (var user of msg.mentions.users) {
			// user[0] is the id, user[1] is the obj
			var name = `${user[1].username}: ${user[0]}`
			mentions.push(name)
		}

    msg.channel.send(mentions);
  }
}