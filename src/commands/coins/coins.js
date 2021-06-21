const { Command } = require('../../../commands.js')
const db = require('../../database/db.js');

module.exports = class CoinsCommand extends Command {
  constructor(){
    super({
      name: 'coins',
      aliases: ['Coins'],
			args : [],
      category: 'coins',
      priority: 9,
      permLvl: 0
    });
  }
  async execute(msg){
    let data = await db.coinSystem.coins.viewMember(msg.author.id);

    if(data){
      msg.channel.send(`Tienes **${data.coins} monedas**.`)
    } else {
      
      await db.coinSystem.coins.addMember(msg.author.id, 10, 0)
      
      let data = await db.coinSystem.coins.viewMember(msg.author.id);
      msg.channel.send(`Tienes **${data.coins} monedas**.`)
    }

  }
}