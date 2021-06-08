// const commands because commands contains the class Command and Argument
const commands = require('../../../commands.js')
const lang = require("../../util").getLanguage()

module.exports = class ClearCommand extends commands.Command {
  constructor(){
    super({
      name: 'clear',
      aliases: ['Clear'],
      args: [
        new commands.Argument({
          optional: true,
					type: "number",
          missingError: lang.error.noArgs.arg,
          invalidError: lang.error.incoArgs.text
        })
      ],
      category: 'blank',
      priority: 1,
      permLvl: 1
    });
  }
  execute(msg, args){
		const number = Number(args[0])
		var maxNumber;
    if(!number){
				maxNumber = 100
			}else{
				maxNumber = Math.min(number+1, 100)
			}
			msg.channel.bulkDelete(maxNumber)
						.then(messages => console.log(`Bulk deleted ${messages.size} messages`))
						.catch(console.error);
  }
}