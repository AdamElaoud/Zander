const Discord = require("discord.js");
const Config = require("./config.js");
const Channels = require("./channels.js");
const Format = require("./format.js");
const Roles = require("./roles.js");

module.exports = {
    name: "error",
    description: "sends errors that Kiwi encounters to a logging channel",
    log(bot, msg, cmd, error) {
        const log = new Discord.MessageEmbed()
            .setColor("#DD2E44")
            .setTitle(":exclamation: **━━━━━━━━━━━ ERROR ━━━━━━━━━━━** :exclamation:")
            .setDescription(`**Command Used:** ${cmd}`
                            + `\n**User:** ${msg.author}`
                            + `\n**Server:** ${bot.guilds.cache.get(msg.guild.id).name}`
                            + `\n**Channel:** ${msg.channel}`
                            + `\n**Date:** ${new Date()}`
                            + `\n\n**Error:**`
                            + `\n${error}`)
            .setFooter(Format.footer.text, Format.footer.image);

        bot.channels.cache.get(Channels.errorLog).send(log);
        bot.channels.cache.get(Channels.errorLog).send(Roles.dev.pub);
    },
    accountError(id) {
        const error = new Discord.MessageEmbed()
            .setColor("#DD2E44")
            .setTitle(":exclamation: **━━━━━ ERROR ━━━━━** :exclamation:")
            .setDescription(`Whoops! Looks like <@${id}> hasn't created an account!`)
            .addField("\u200b", "\u200b")
            .setFooter(Format.footer.text, Format.footer.image);

        return error;
    },
    ownerError() {
        const error = new Discord.MessageEmbed()
            .setColor("#DD2E44")
            .setTitle(":exclamation: **━━━━━ ERROR ━━━━━** :exclamation:")
            .setDescription(`You must be the bot owner, ${Config.owner.pub}, to use this command!`)
            .addField("\u200b", "\u200b")
            .setFooter(Format.footer.text, Format.footer.image);
        
        return error;
    },
    badInputError(input) {
        const error = new Discord.MessageEmbed()
            .setColor("#DD2E44")
            .setTitle(":exclamation: **━━━━━ ERROR ━━━━━** :exclamation:")
            .setDescription(`You did not provide the correct input!`
                            + `\n\nYou entered: **"${input}"**`)
            .addField("\u200b", "\u200b")
            .setFooter(Format.footer.text, Format.footer.image);
        
        return error;
    }
}