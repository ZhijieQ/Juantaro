const fs = require('fs');
const util = require('./util.js');
const config = util.getConfig();
const lang = util.getLanguage();

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
  checkArgs(msg, msgArgs){
      let index = 0
			// For each argument commands
      for (let cmdArg of this.args) {
        /**
         * Now there are 4 possibilities:
         *  - Its not a optional argument and there are not more message arguments,
         *    that means the message is invalid.
         *  - Its not a optional argument but there is a message argument,
         *      * If Arg.checkArg() is true, increase the index to check next argument.
         *      * If Arg.checkArg() is false, that means message is invalid.
         *  - Its a optional argument and there are not more message arguments,
         *    continue the loop without increase the index.
         *  - Its a optional argument but there is a message argument:
         *      * If Arg.checkArg() is true, increase the index to check next argument.
         *      * If Arg.checkArg() is false, that means this optional argument 
         *        is not in the message, so we dont increase the index 
         *        but need to continue the loop.
         * Extra: when we have a message argument,
         * need to check if the type coincide, use Argument.checkArg() to check.
         */

        if(msgArgs[index] && cmdArg.checkArg(msg, msgArgs[index])){
          index++;
        }else if(!cmdArg.optional){
          util.send(msg, cmdArg.invalidError);
          return false;
        }
      }
    return true;
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
	 * The check argument coincide with the type
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
      case 'number':
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
			case 'string':
				break;

			default:
				return false;
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
  namesAliases: new Map(),
  commands: new Map(),
	blankNamesAliases: new Map(),
	blankCommand: new Map(),
	categories: new Map(),

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

		var blank = false;

		// Read each category(a module)
    for(var category of cmds){
			// Read all file in the category
      var files = fs.readdirSync(`./src/commands/${category}`);

			if (category === "blank") {
				blank = true
			}

      for(var file of files){
				// Check if the file is a File
        if(fs.statSync(`./src/commands/${category}/${file}`).isFile()){
					// There are differents commands in the file
					// Example, const { Command } = require('./commands')
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

							if (blank) {
								// Set a blank command
								this.blankCommand.set(command.name, command)

								// Set all alias
								for (var alias of command.aliases){
									this.blankNamesAliases.set(alias, command)
								}
							}

							// Set a command
							this.commands.set(command.name, command)

							// Set all alias
							for (var alias of command.aliases){
								this.namesAliases.set(alias, command)
							}

							// Set command in the category
              this.categories.get(category).addCommand(command)
            }
          }
        }
      }

			if (blank){
				blank = false;
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
		// Suppose that all command has Member permission
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
	 * @param blank: True if it is a blank command
	 * @return command: the command object
	 * @version: 1.0
	 * @author: Zhijie
	 */
  getCmd: function(name, blank){
		var command;

		// Check if its a blank command
		if (blank) {
			command = this.blankCommand.get(name);

			// If there is no command, maybe is a alias
			if(!command) {
				command = this.blankNamesAliases.get(name)
			}
		}else{
			command = this.commands.get(name);

			// If there is no command, maybe is a alias
			if(!command) {
				command = this.namesAliases.get(name)
			}
		}

		// Return the null command
    return command;
  },
	/**
	 * Check if the command is valid and 
	 * check if has a permission
	 * !Important: this is async function
	 * 
	 * @param msg: the discord message
	 * @param args: the arguments of the message
	 * @param blank: True if it is a blank command
	 * @return boolena: True if is validated, False if not
	 * @version: 1.0
	 * @author: Zhijie
	 */
  checkValidCmd: async function(msg, args, blank){
		var command = this.getCmd(args[0], blank)
    
		// Check if there is a command and the permision
    if(command && this.checkPerms(msg, command.permLvl)){
			return true;
		}

    return false;
  },
	/**
	 * Execute the command after validated
	 * !Important: this is async function
	 * 
	 * @param msg: the discord message
	 * @param args: the arguments of the message
	 * @param blank: True if it is a blank command
	 * @version: 1.0
	 * @author: Zhijie
	 */
  executeCmd: async function(msg, args, blank){
    let cmd = this.getCmd(args[0], blank)
    arguments = args.slice(1)

		// Check the Arguments first, and then execute
    if(cmd.checkArgs(msg, arguments)) {
     await cmd.execute(msg, arguments)
    }
  }
}