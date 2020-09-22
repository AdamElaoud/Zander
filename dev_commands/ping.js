const Discord = require("discord.js");
const Channels = require("../util/channels.js");
const Config = require("../util/config.js");
const Emojis = require("../util/emojis.js");
const ErrorLog = require("../util/errors.js");
const Format = require("../util/format.js");

module.exports = {
    name: "ping",
    description: "dev command: check bot's ping",
    execute(bot, msg) {
        // react to command
        msg.react(bot.emojis.cache.get(Emojis.zander.id));
        
        // allow usage only if user is the owner
        if (msg.author.id === Config.owner.id) {
            const yourPing = new Date().getTime() - msg.createdTimestamp;
            const botPing = Math.round(bot.ws.ping);

            const ping = new Discord.MessageEmbed()
                .setColor("#CCD6DD")
                .setTitle(":satellite: **━━━ BOT PING ━━━** :satellite:")
                .setDescription(`**Your Ping:** ${yourPing}ms`
                                + `\n**Bot's Ping:** ${botPing}ms`)
                .addField("\u200b", "\u200b")
                .setFooter(Format.footer.text, Format.footer.image);

            bot.channels.cache.get(Channels.devCmds).send(ping).catch(err => ErrorLog.log(bot, msg, "dev command ping", err));

        } else {
            const error = new Discord.MessageEmbed()
                .setColor("#DD2E44")
                .setTitle(":exclamation: **━━━━━ ERROR ━━━━━** :exclamation:")
                .setDescription(`You must be the bot owner, ${Config.owner.pub}, to use this command!`)
                .addField("\u200b", "\u200b")
                .setFooter(Format.footer.text, Format.footer.image);

            msg.channel.send(error).catch(err => ErrorLog.log(bot, msg, "dev command ping [not dev response]", err));
        }
    }
}