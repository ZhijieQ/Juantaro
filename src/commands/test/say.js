// const commands because commands contains the class Command and Argument
const commands = require('../../../commands.js')
const lang = require("../../util").getLanguage()

module.exports = class SayCommand extends commands.Command {
  constructor(){
    super({
      name: 'say',
      aliases: ['s', 'Say'],
      args: [
        new commands.Argument({
          optional: false,	// Require the argument
					type: "string",
          missingError: lang.error.noArgs.arg,
          invalidError: lang.error.incoArgs.text
        })
      ],
      category: 'test',
      priority: 9,
      permLvl: 1
    });
  }
  execute(msg, args){
    msg.channel.send(args.join(' '));
  }
}