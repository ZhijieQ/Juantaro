const { Command } = require('../../../commands.js')
const util = require("../../../util")

module.exports = class TestCommand extends Command {
  constructor(){
    super({
      name: 'test',
      aliases: ['t'],
      category: 'test',
      priority: 9,
      permLvl: 0
    });
  }
  execute(msg){
    const name = msg.content.trim().split(/\s+/)[1]
		//console.log(name)
		if (name) {
			util.send(msg, `Fuck you ${name}!`)
		}else{
			util.send(msg, `Fuck you ${msg.author}!`)
		}
  }
}