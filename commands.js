const fs = require('fs');
const util = require('./util.js');
const config = util.getConfig();
const lang = util.getLanguage("English");

/**
 * The class Command
 * 
 * @param name: the name of the command
 * @param aliases: the alias of the command
 * @param args: the arguments of the command
 * @param category: the category of the command
 * @param permLvl: the permision level of the command
 * @param priority: the priority of the command. 0 has more priority
 * @version: 1.0
 * @author: Zhijie
 */
class Command {
  constructor(info) {
    this.name = info.name;
		this.aliases = info.aliases;
    this.args = info.args;
    this.category = info.category;
    this.permLvl = info.permLvl;
    this.priority = info.priority;
  }

	/**
	 * The check arguments function
	 * 
	 * @param msg: the discord message
	 * @param msgArgs: the arguments of the discord message
	 * @return valid: True if are valid arguments, False if are not
	 * @version: 1.0
	 * @author: Zhijie
	 */
	//TODO: need to revise
  checkArgs(msg, msgArgs){
		// Set valid to start
    var valid = true;

		/**
		 * If the command dont need arguments, return valid true
		 * If the command need arguments, need to check first
		 */
    if(this.args != undefined){

			/** 
			 * If the discord arguments is 0 and 
			 * the command arguments that are not optional is defined,
			 * means the sintax is bad.
			 */
      if(msgArgs.length == 0 && this.args.find(x => !x.optional) != undefined){
        util.send(msg, lang.error.noArgs.arg);
        return false;
      }

      let index = 0
			// For each argument commands
      for(let cmdArg of this.args) {
        console.log(cmdArg)
				console.log(index)
				console.log(cmdArg[index])
				
				// Check the index argment is defined
        if(cmdArg[index] != undefined){
					// Check if is optional
          if(!cmdArg.optional) {
            util.send(msg, cmdArg.missingError);
            break;
          }

				// Case if the argument is not defined
        } else {
					console.log(cmdArg.optional)
					console.log(cmdArg.failOnInvalid)
					console.log(cmdArg.breakOnValid)
          // Check if is a valid argument
          if (!cmdArg.checkArg(msg, msgArgs[index])) {
						// If is not a valid argument, Check if is optional
            if (!cmdArg.optional || cmdArg.failOnInvalid) {
              //enviar un mensaje de error
              util.send(msg, cmdArg.invalidError);
              valid = false;
              break;
            }
          } else {
						// If is a valid argument, check if need to break
            if (cmdArg.breakOnValid) {
              break;
            }
            // Increment the counter for next argument of the message
            index++;
          }
        }
				console.log("\n")
      }
    }
    return valid;
  }
}

/**
 * The class Argument
 * 
 * @param optional: True if its a optional arguments
 * @param type: the type of the argument
 * @param interactiveMsg: True if its a interactive message
 * @param possibleValues: the possible values of the argument
 * @param missingError: the missing argument message, case when the command need argument
 * @param invalidError: the invalid argument message, case when the arguments is not valid
 * @version: 1.0
 * @author: Zhijie
 */
class Argument {
  constructor(info) {
    this.optional = info.optional;
    this.type = info.type;
    this.interactiveMsg = info.interactiveMsg;
    this.possibleValues = info.possibleValues;
    this.missingError = info.missingError;
    this.invalidError = info.invalidError;
		
    //util.send(msg, ':x: Ese argumento no es valido.');
    //util.send(msg, ':x: ¡Error!, falta un argumento.')
    //util.send(msg, "No tienes suficientes permisos para eso.")
  }

	/**
	 * The check argument function
	 * 
	 * @param msg: the discord message
	 * @param msgArgs: the arguments of the discord message
	 * @return valid: True if is a valid argument, False if is not
	 * @version: 1.0
	 * @author: Zhijie
	 */
  checkArg(msg, msgArg){
    var valid = true;
    
		// Iterate each type
    switch(this.type) {
      case 'mention': 
        //<@!8181518181818181>
        let mention = msgArg.match(/<@!?(.*?[0-9])>/);

				// the sintax (.*?[0-9]) represent channel[1]
        if (mention == null || !msg.guild.members.cache.has(mention[1])) {
          valid = false;
        }

        break;
      case 'int':
        if(!Number(msgArg)){
          valid = false;
        }

        break;
      case 'channel':
        // <#1586128918181818>
        let channel = msgArg.match(/<#(.*?)>/);
				
				// the sintax (.*?) represent channel[1]
        if (channel == null || !msg.guild.channels.cache.has(channel[1])) {
          valid = false;
        }

        break;
    }
    return valid;
  }
}

/**
 * The class Category
 * 
 * @param name: the name of the category
 * @param priority: the priority of the category
 * @param commands: the map of the command of the category
 * @version: 1.0
 * @author: Zhijie
 */
class Category {
  constructor(info){
    this.name = info.name
    this.priority = info.priority;
    this.commands = new Map();
  }

	/**
	 * Add the new command in the map
	 * 
	 * @param command: the new command in the category
	 * @version: 1.0
	 * @author: Zhijie
	 */
  addCommand(command){
    this.commands.set(command.name, command)
  }
}

/**
 * Module exports:
 * - Command: the class command
 * - Argument: the class argument
 * - Category: the class category
 * 
 * - namesAliases: names of alias
 * - categories: the map of category
 * - command: the map of command
 * 
 * - registerCategories: the function to regist a new Category
 * - registerCommands: the function to regist a new command
 * - 
 */
module.exports = {
	// Declarations of the class
  Command: Command,
  Argument: Argument,
  Category: Category,

	// Declarations of the variables
  namesAliases: [],
  categories: new Map(),
  commands: new Map(),

	/**
	 * Load the file
	 * 
	 */
	loadFile: function(path){
    return require(path)
  },
	/**
	 * Regist a list of categories in the map
	 * 
	 * @param categories: the list of categories
	 * @version: 1.0
	 * @author: Zhijie
	 */
  registerCategories: function (categories){
    for(category of categories){
      var category = new Category(category)
      this.categories.set(category.name, category)
    }
  },
	/**
	 * Regist a list of command in the map
	 * 
	 * @version: 1.0
	 * @author: Zhijie
	 */
  registerCommands: function(){
		// Read the commands dir
    var cmds = fs.readdirSync(`./src/commands/`);

		// Read each category(a module)
    for(var category of cmds){
			// Read all file in the category
      var files = fs.readdirSync(`./src/commands/${category}`);

      for(var file of files){
				// Check if the file is a File
        if(fs.statSync(`./src/commands/${category}/${file}`).isFile()){
					// There are differents commands in the file
					// Example, const { Command } = require('./src/commands')
          var keys = require(`./src/commands/${category}/${file}`)

					// Validate the keys to a Object, use for 1 command in the file
          if(typeof keys != 'object'){
            keys = { keys }
          }

					// For each command in the file
          for(var key in keys){
						// If the command could be instance, then create the instance
            if (keys[key].prototype instanceof Command) {
							// Remember that keys[key] is a Command Object(extend by Command)
              var command = new keys[key]();

							// Use for first time to regist the category
              if(!this.categories.has(category)){
								// Remember that registerCategories() need a list of Categories
                this.registerCategories([category])
              }
             
						  // Set a command
              this.commands.set(command.name, command)
							// There could be more than one alias, use ... for get all
              this.namesAliases.push(command.name, ...command.aliases)
							// Set command in the category
              this.categories.get(category).addCommand(command)
            }
          }
        }
      }
    }
  },
	/**
	 * Check if the message author has the permission to use this command
	 * 
	 * @param msg: the discord message
	 * @param permLvl: the permision level of the command
	 * @return boolean: True if has permission, False if has not
	 * @version: 1.0
	 * @author: Zhijie
	 */
  checkPerms: function(msg, permLvl){
		// Valide the developer member
		for(var superuser of config.superusers) {
			// console.log(superuser)
			if (msg.author.id === superuser){
				return true;
			}
		}
    
		// Get the permission of the message author as guild member
    let perms = msg.member.permissions;

		// Admin has all permission
    if(perms.has('ADMINISTRATOR')) {
      return true;
    }
    
		// TODO: print the permissions to see the permission
    let userPermsLvl = 1;
    if(userPermsLvl >= permLvl){
      return true;
    }
    
		// Not have permission enought
    util.send(msg, `${msg.author}: ${lang.error.noPerms}`);
    return false;
  },
	/**
	 * Get the command by name
	 * 
	 * @param name: the name of the command
	 * @return command: the command object
	 * @version: 1.0
	 * @author: Zhijie
	 */
  getCmd: function(name){
    var command = this.commands.get(name);
    
		// If does not get the command, maybe is the alias
    if(!command) {
      this.commands.forEach(function(aCmd){
        if(aCmd.aliases.includes(name)){
          command = aCmd;
          return;
        }
      })
    }
    return command;
  },
	/**
	 * Check if the command is in the list
	 * !Important: this is async function
	 * 
	 * @param msg: the discord message
	 * @param args: the arguments of the message
	 * @param prefix: the prefix of the command
	 * @return boolena: True if is validated, False if not
	 * @version: 1.0
	 * @author: Zhijie
	 */
  checkValidCmd: async function(msg, args, prefix){
		// Get the command using first arguments
    var command = this.getCmd(args[0]);
    
		// First check if has prefix and then check the permision
    if(msg.content.toLowerCase().startsWith(prefix) && command != null){
      let result = this.checkPerms(msg, command.permLvl)
      if(result){
        return true;
      }
    }
    
    return false;
  },
	/**
	 * Execute the command after validated
	 * !Important: this is async function
	 * 
	 * @param msg: the discord message
	 * @param args: the arguments of the message
	 * @version: 1.0
	 * @author: Zhijie
	 */
  executeCmd: async function(msg, args){
    let cmd = this.getCmd(args[0])
    arguments = args.slice(1)
    if(cmd.checkArgs(msg, arguments)) {
     await cmd.execute(msg, arguments)
    }
  }
}