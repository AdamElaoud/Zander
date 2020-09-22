const Discord = require("discord.js");
const Emojis = require("../util/emojis.js");
const ErrorLog = require("../util/errors.js");
const Format = require("../util/format.js");

module.exports = {
    name: "lookup",
    description: "command: view a player's profile",
    execute(bot, msg) {
        // react to command
        msg.react(bot.emojis.cache.get(Emojis.zander.id));
        
    }
}