// created by Adam Elaoud (Sap#5703)
// copyright (c) 2020

const Discord = require("discord.js");
const FS = require("fs");
const Config = require("./util/config.js");
require("dotenv-flow").config();

// instantiate bot
const bot = new Discord.Client();
bot.commands = new Discord.Collection();
bot.events = new Discord.Collection();

// fill command collection
const commandFiles = FS.readdirSync("./commands");
for (const file of commandFiles) {
	let command = require(`./commands/${file}`);
	bot.commands.set(command.name, command);
}

// fill event collection
const eventFiles = FS.readdirSync("./events");
for (const file of eventFiles) {
	let event = require(`./events/${file}`);
	bot.events.set(event.name, event);
}

bot.on("ready", () => {
	bot.user.setActivity(`🎩 Conjuring`);
	
	bot.users.fetch(Config.owner.id).then(
		function(user) {
			let date = new Date();
			user.send("Bot Online! **" + date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds() + "**");
		}
    ).catch(err => {console.log("Error sending message! Error: ", err.message)});
    
    // send launch notification
    console.log(`Logged in as ${bot.user.tag}!`);
});

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
		case "ping":
			bot.commands.get("ping").execute(bot, message);
			break;
		case "servers":
			bot.commands.get("servers").execute(bot, message);
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
		default:
			bot.commands.get("unrecognized").execute(bot, message, command);
	}
});

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