const Discord = require("discord.js");
const MongoDB = require("mongodb").MongoClient;
const Emojis = require("../util/emojis.js");
const ErrorLog = require("../util/errors.js");
const Format = require("../util/format.js");


module.exports = {
    name: "school",
    description: "command: set player school",
    async execute(bot, msg) {
        // react to command
        msg.react(bot.emojis.cache.get(Emojis.zander.id));
        
        // create database client
        const dbClient = new MongoDB(process.env.MONGOURI, { useUnifiedTopology: true });

        try {
            await dbClient.connect();
            const db = dbClient.db("ZanderDB");
            const users = db.collection("users");

        } catch (err) {
            ErrorLog.log(bot, msg, `command school`, err);
        }

        
        // msg.channel.send(EMBED HERE).catch(err => ErrorLog.log(bot, msg, "invite", err));
    }
}