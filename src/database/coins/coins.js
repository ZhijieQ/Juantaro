const queries = require('../queries.js');

module.exports = {
  viewMember: async function(iduser){
    let select = 'SELECT * FROM coins WHERE iduser = ?'
    let result = await queries.getQuery(select, iduser);
    
    if(result != undefined){
      return result;
    } 
    return false;
  },
  addMember: async function(iduser, coins, status){
    let select = 'SELECT * FROM coins WHERE iduser = ?'
    let result = await queries.getQuery(select, iduser);
    
    if(result == undefined){
      let insert = 'INSERT INTO coins(iduser, coins, status) VALUES(?, ?, ?)';
      await queries.runQuery(insert, [iduser, coins, status]);
      console.log('New user for coinSystem!')
    }
  },
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