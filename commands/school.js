const Discord = require("discord.js");
const MongoDB = require("mongodb").MongoClient;
const Emojis = require("../util/emojis.js");
const ErrorLog = require("../util/errors.js");
const Format = require("../util/format.js");


module.exports = {
    name: "school",
    description: "set player school",
    execute(bot, msg) {
        // react to command
        msg.react(bot.emojis.cache.get(Emojis.zander.id));
        
        // if user is not in database init their file

        
        // msg.channel.send(EMBED HERE).catch(err => ErrorLog.log(bot, msg, "invite", err));
    }
}