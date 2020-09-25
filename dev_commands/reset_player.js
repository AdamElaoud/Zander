const Discord = require("discord.js");
const Channels = require("../util/channels.js");
const Config = require("../util/config.js");
const Emojis = require("../util/emojis.js");
const ErrorLog = require("../util/errors.js");
const Format = require("../util/format.js");
const UserDoc = require("../database/user_doc.js");

module.exports = {
    name: "reset_player",
    description: "dev command: reset player data document",
    async execute(bot, msg, args) {
        // react to command
        msg.react(bot.emojis.cache.get(Emojis.zander.id));

        // allow usage only if user is the owner
        if (msg.author.id === Config.owner.id) {
            const id = Format.isolateID(args[0]);
            const mention = `<@${id}>`;

            // if valid id provided
            if (id !== null) {
                try {
                    await UserDoc.reset(bot, msg, id);

                    const reset = new Discord.MessageEmbed()
                        .setColor("#55ACEE")
                        .setTitle(":busts_in_silhouette: **━━━ PLAYER RESET ━━━** :busts_in_silhouette:")
                        .setDescription(`Successfully reset user: ${mention}`)
                        .addField("\u200b", "\u200b")
                        .setFooter(Format.footer.text, Format.footer.image);
        
                    bot.channels.cache.get(Channels.devCmds).send(reset).catch(err => ErrorLog.log(bot, msg, `dev command reset_player: successful reset message of ${mention}`, err));
    
                } catch (err) {
                    ErrorLog.log(bot, msg, `dev command reset_player: ${mention}`, err);
                }

            } else {
                const error = new Discord.MessageEmbed()
                    .setColor("#DD2E44")
                    .setTitle(":exclamation: **━━━━━ ERROR ━━━━━** :exclamation:")
                    .setDescription(`You did not enter a correct user ID!`
                                    + `\nYou entered: **${args[0]}**`)
                    .addField("\u200b", "\u200b")
                    .setFooter(Format.footer.text, Format.footer.image);

                msg.channel.send(error).catch(err => ErrorLog.log(bot, msg, "dev command reset_player [ID error]", err));
            }

        } else {
            const error = new Discord.MessageEmbed()
                .setColor("#DD2E44")
                .setTitle(":exclamation: **━━━━━ ERROR ━━━━━** :exclamation:")
                .setDescription(`You must be the bot owner, ${Config.owner.pub}, to use this command!`)
                .addField("\u200b", "\u200b")
                .setFooter(Format.footer.text, Format.footer.image);

            msg.channel.send(error).catch(err => ErrorLog.log(bot, msg, "dev command reset_player [not dev response]", err));
        }
    }
}