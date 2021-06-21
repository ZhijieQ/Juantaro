const express = require("express")
const server = express()

// Host in uptimeRobot with follow url
server.all("/", (req, res) => {
  res.send("Bot is running!")
})

/**
 * Open a port for the server
 * 
 * @version: 1.0
 * @author: Zhijie
 */
function keepAlive() {
  server.listen(3000, () => {
    console.log("Server is ready.")
  })
}

module.exports = { keepAlive }