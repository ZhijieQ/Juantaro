const sqlite3 = require('sqlite3').verbose();
// This need full path cause you are creating a new Database instead of requite()
const sql = new sqlite3.Database('./src/database/sqlite3/bot.db');

/**
 * Inicialize the bot database for coinSystem
 * 
 * @version: 1.0
 * @author: Zhijie
 */
async function tableCoins(){
  await sql.run('CREATE TABLE IF NOT EXISTS coins (iduser TEXT PRIMARY KEY, coins INTEGER, status INTEGER)');
  await sql.run('CREATE TABLE IF NOT EXISTS userLevels (usersUnique TEXT PRIMARY KEY, iduser TEXT UNIQUE, idserver TEXT, level INTEGER, xp INTEGER DEFAULT 0)')
}

module.exports = {
  createTables: async function(){
    try {
      await tableCoins();
    } catch (e) {
      console.error(e)
    }
  }
}