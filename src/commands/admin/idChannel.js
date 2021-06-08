const commands = require('../../../commands.js')
const lang = require('../../util.js').getLanguage();

module.exports = class IdChannelCommand extends commands.Command {
  constructor(){
    super({
      name: 'idC',
      aliases: ['idChannel', 'idchannel', 'IdChannel', 'Idchannel'],
      args: [
        new commands.Argument({
          optional: true,
          type: 'channel',
          missingError: lang.error.noArgs.mention,
          invalidError: lang.error.incoArgs.text
        })
      ],
      category: 'test',
      priority: 0,
      permLvl: 3
    });
  }
  execute(msg, args){
		console.log(msg.channel)
    let mentions = msg.channel;
    
    msg.channel.send(mentions.id);
  }
}