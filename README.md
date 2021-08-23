# Juantaro

Juantaro is a public Discord Bot developed by Zhijie using Javascript.
It's a modular bot so you just need add a new command in the specific dir.

## How to Create new Command:
**Require**:
```javascript
const util = require("../../util")
const lang = util.getLanguage()
const config = util.getConfig()
```

**Argument**:
Argument class for Command, could be Optional or Required.

- _optional_: true or false.
- _type_: "mention", if you want mention someone in the chat. <br/>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp"channel", if you want mention some channel. <br/>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp"number", if the argument is a number. <br/>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp"string", if the argument is a string.
- _missingError_: custom missing error, could change or add new one from /languages/file.json.
- _invalidError_: custom invalid error, could change or add new one from /languages/file.json.

```javascript
new commands.Argument({
				optional: true,
				type: "mention",
				missingError: lang.error.noArgs.mention,
				invalidError: lang.error.incoArgs.text
			})
```

**Command**:
The command to implement.

- Constructor():
	- _name_: the name of the command.
	- _aliases_: the aliases of the command.
	- _args_: the args of the command, could leave it empty.
	- _category_: the category of the command, it has to be a type that is described in the config.js(you also could add new ones) and the newCommand.js has to be in the same category name folder.
	- _priority_: is useless for now because we dont have a specific queue to make some command run before than others.
	- _permLvl_: 0 for all member permission and 3 for admin level, the rest is useless and not implemented.

- specificHelp(admin): this method is used when someone need to know how to use the command, like the command man from linux.
- execute(msg, args, info): the main method that describe how this command will be executed.
	- _msg_: the message of the discord.
	- _args_: all possible args that you want include.
	- _info_: the info config for music module.

```javascript
module.exports = class PlayCommand extends commands.Command {
  constructor(){
    super({
      name: 'play',
      aliases: ['p'],
      args: [
        new commands.Argument({
          optional: false,
          type: 'string',
          missingError: lang.error.noArgs.mention,
          invalidError: lang.error.incoArgs.text
        })
      ],
      category: 'music',
      priority: 7,
      permLvl: 0
    });
  }
	specificHelp(admin){
		// Your command
	}
	async execute(msg, args, info){
		// Your command
	}
}
```

## Note:
Cause this bot is hosted by Replit that has **Secrets Enviroment Variables**, so if you want to use this bot, you should create a **.env** file with **TOKEN=***** inside. Maybe you need change the line **const TOKEN = process.env["TOKEN"]** to ** = process.env.TOKEN** in the **index.js** file cause we never tested this situation.

## Tecnology Uses:
 - Javascript: all this code are developed using Javascript with **OOP(Object Oriented Programming)**.

 - Replit: this bot is hosted on the web https://replit.com/.
 
 - Uptimerobot: to keep this bot working all the day without pay a upgrade Replit version, we use Uptimerobot to ping the server each 5 min, so the bot will continue to work unless it finds a bug(Uptimerobot could send you a email when the server is down).