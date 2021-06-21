const sqlite3 = require('sqlite3').verbose();
const sql = new sqlite3.Database('./src/database/sqlite3/bot.db');
const config = require('../util.js').getConfig();

module.exports = {
	/**
	 * Run the query.
	 * Use for select, set, update, delete
	 * 
	 * @param query: the query with sintax 'SELECT * FROM coins WHERE idUse = ?'
	 * @param args: the arguments that reference '?' of the query
	 * @author Zhijie
	 * @version 1.0
	 */
	runQuery: async function(query, args){
		try {
			await sql.run(query, args)
		} catch (e) {
			console.error(e)
		}
	},
	/**
	 * Query the first row in the result set.
	 * Use for select
	 * 
	 * @param query: the query with sintax 'SELECT * FROM coins WHERE idUse = ?'
	 * @param args: the arguments that reference '?' of the query
	 * @author Zhijie
	 * @version 1.0
	 */
	getQuery: async function(query, args){
    try {
      var result = 
        new Promise((resolve, reject) => {
          sql.get(query, args, function(err, row){
            if(err) reject(err);
            resolve(row)
          })
        })
    } catch (e){
      console.error(e)
    }
    return result;
  },
	/**
	 * Quering all colum.
	 * Use for select
	 * 
	 * @param query: the query with sintax 'SELECT * FROM coins WHERE idUse = ?'
	 * @param args: the arguments that reference '?' of the query
	 * @author Zhijie
	 * @version 1.0
	 */
  allQuery: async function(query, args){
    try {
      var result = 
        new Promise((resolve, reject) => {
          sql.all(query, args, function(err, row){
            if(err) reject(err);
            resolve(row)
          })
        })
    } catch (e){
      console.error(e)
    }
    return result;
  }
}
