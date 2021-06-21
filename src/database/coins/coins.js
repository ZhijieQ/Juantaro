const queries = require('../queries.js');

module.exports = {
  /**
	 * Get the coin from iduser.
	 * 
	 * @param iduser: the discord id of the user
   * @return result: the table of the coins with iduser
   * @return false: if has a error
	 * @author Zhijie
	 * @version 1.0
	 */
  viewMember: async function(iduser){
    let select = 'SELECT * FROM coins WHERE iduser = ?'
    let result = await queries.getQuery(select, iduser);
    
    if(result != undefined){
      return result;
    } 
    return false;
  },
  /**
	 * Add a new user in the table
	 * 
	 * @param iduser: the discord id of the user
   * @param coins: the number of coins to add
   * @param status: this is useless for now
	 * @author Zhijie
	 * @version 1.0
	 */
  addMember: async function(iduser, coins, status){
    let select = 'SELECT * FROM coins WHERE iduser = ?'
    let result = await queries.getQuery(select, iduser);
    
    if(result == undefined){
      let insert = 'INSERT INTO coins(iduser, coins, status) VALUES(?, ?, ?)';
      await queries.runQuery(insert, [iduser, coins, status]);
      console.log('New user for coinSystem!')
    }
  },
  /**
	 * Update the number of coins for iduser
	 * 
	 * @param iduser: the discord id of the user
   * @param coins: the number of coins to update
	 * @author Zhijie
	 * @version 1.0
	 */
  updateCoin: async function(iduser, coins) {
    let select = 'SELECT * FROM coins WHERE iduser = ?'
    let result = await queries.getQuery(select, iduser);
    
    if(result != undefined){
      let update = 'UPDATE coins SET coins = coins + ? WHERE iduser = ?';
      await queries.runQuery(update, [coins, iduser]);
      
      console.log(`The user ${iduser} has been updated.`)
    }
  }
}