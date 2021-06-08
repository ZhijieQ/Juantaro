// const { Commands } because we only need the class Command and not Argument
const { Command } = require('../../../commands.js')

module.exports = class TestCommand extends Command {
  constructor(){
    super({
      name: 'test',
      aliases: [],
			args: [],
      category: 'test',
      priority: 9,
      permLvl: 0
    });
  }
  execute(msg){
    const name = msg.content.trim().split(/\s+/)[1]
		//console.log(name)
		if (name) {
		  msg.channel.send(`Fuck you ${name}!`)
		}else{
			msg.channel.send(`Fuck you ${msg.author}!`)
		}
  }
}