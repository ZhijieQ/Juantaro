const sqlite3 = require('sqlite3').verbose();
const sql = new sqlite3.Database('../sqlite3/bot.db')
const config = require('../../util.js').getConfig();

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