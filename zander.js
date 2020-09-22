// created by Adam Elaoud (Sap#5703, ID: 193427298958049280)
// copyright (c) 2020

const Discord = require("discord.js");
const FS = require("fs");
const Config = require("./util/config.js");
require("dotenv-flow").config();

// instantiate bot
const bot = new Discord.Client();

// fill command collection
bot.commands = new Discord.Collection();
const commandFiles = FS.readdirSync("./commands");
for (const file of commandFiles) {
	let command = require(`./commands/${file}`);
	bot.commands.set(command.name, command);
}

// fill dev command collection
bot.devCommands = new Discord.Collection();
const devCommandFiles = FS.readdirSync("./dev_commands");
for (const file of devCommandFiles) {
	let command = require(`./dev_commands/${file}`);
	bot.devCommands.set(command.name, command);
}

// fill event collection
bot.events = new Discord.Collection();
const eventFiles = FS.readdirSync("./events");
for (const file of eventFiles) {
	let event = require(`./events/${file}`);
	bot.events.set(event.name, event);
}

bot.on("ready", () => {
	bot.user.setActivity(`🎩 Conjuring`);
	
	// send online notification if not in devmode
	if (!Config.devmode) {
		bot.users.fetch(Config.owner.id).then(
			function(user) {
				let date = new Date();
				user.send("Bot Online! **" + date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds() + "**");
			}
		).catch(err => {console.log("Error sending message! Error: ", err.message)});
	}
    
    // send launch notification
    console.log(`Logged in as ${bot.user.tag}!`);
});

// command parsing
bot.on("message", message => {
	// if another bot sent the message, if it has attachments, or if the prefix wasn't used, do nothing
	if (message.author.bot || message.attachments.size !== 0 || !message.content.startsWith(Config.prefix))
		return;

	// if in devmode, only respond to dev
	if (Config.devmode && message.author.id !== Config.owner.id) {
		return;
	}

	// parsing command and arguments beginning after the prefix
	let args = message.content.substring(Config.prefix.length).split(/[\s|\r?\n|\r]/);
	// remove any remaining empty space
	args = args.filter(ele => ele !== "" && ele !== " ");
	// retrieve command
	command = args.shift();

	// checking command request
	switch(command) {
		// player commands
		case "school":
			bot.commands.get("school").execute(bot, message, args);
			break;
		case "invite":
			bot.commands.get("invite").execute(bot, message);
			break;
		case "bug":
			bot.commands.get("bug").execute(bot, message, args);
			break;
		case "suggest":
			bot.commands.get("suggest").execute(bot, message, args);
			break;
		case "profile":
			bot.commands.get("profile").execute(bot, message, args);
			break;
			

		// dev commands
		case "ping":
			bot.devCommands.get("ping").execute(bot, message);
			break;
		case "servers":
			bot.devCommands.get("servers").execute(bot, message);
			break;
		case "initplayer":
			bot.devCommands.get("init_player").execute(bot, message, args);
			break;
		case "resetplayer":
			bot.devCommands.get("reset_player").execute(bot, message, args);
			break;

		// unrecognized command
		default:
			bot.commands.get("unrecognized").execute(bot, message, command);
	}
});

// event parsing
bot.on("guildCreate", guild => {
	bot.events.get("guildCreate").execute(bot, guild);
});

bot.on("guildDelete", guild => {
	bot.events.get("guildDelete").execute(bot, guild);
});

bot.on("guildUpdate", (oldGuild, newGuild) => {
	bot.events.get("guildUpdate").execute(bot, oldGuild, newGuild);
})

// login to Discord with bot token
if (Config.devmode)
	bot.login(process.env.ZANDERDEVTOKEN);
else
	bot.login(process.env.ZANDERTOKEN);