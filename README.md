# Juantaro

Juantaro is a public Discord Bot developed by Zhijie using Javascript.
It's a modular bot so you just need add a new command in the specific dir.

## How to Use:

## Note:
Cause this bot is hosted by Replit that has **Secrets Enviroment Variables**, so if you want to use this bot, you should create a **.env** file with **TOKEN=***** inside. Maybe you need change the line **const TOKEN = process.env["TOKEN"]** to ** = process.env.TOKEN** in the **index.js** file cause we never tested this situation.

## Tecnology Uses:
 - Javascript: all this code are developed using Javascript with **OOP(Object Oriented Programming)**.

 - Replit: this bot is hosted on the web https://replit.com/.
 
 - Uptimerobot: to keep this bot working all the day without pay a upgrade Replit version, we use Uptimerobot to ping the server each 5 min, so the bot will continue to work unless it finds a bug(Uptimerobot could send you a email when the server is down).