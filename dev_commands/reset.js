const Discord = require("discord.js");
require("mongodb");
const Channels = require("../util/channels.js");
const Config = require("../util/config.js");
const Emojis = require("../util/emojis.js");
const ErrorLog = require("../util/errors.js");
const Format = require("../util/format.js");
const UserDoc = require("../database/init_user.js");

module.exports = {
    name: "reset",
    description: "dev command: reset player data document",
    async execute(bot, msg, args) {
        // react to command
        msg.react(bot.emojis.cache.get(Emojis.zander.id));

        // allow usage only if user is the owner
        if (msg.author.id === Config.owner.id) {
            // if inputs are provided
            if (args.length !== 0) {
                const userID = Format.isolateID(args[0]);
                const mention = `<@${userID}>`;

                // if valid userID provided
                if (userID !== null) {
                    try {
                        await UserDoc.reset(bot, msg, userID);

                        const reset = new Discord.MessageEmbed()
                            .setColor("#55ACEE")
                            .setTitle(":busts_in_silhouette: **━━━ PLAYER RESET ━━━** :busts_in_silhouette:")
                            .setDescription(`Successfully reset user: ${mention}`)
                            .addField("\u200b", "\u200b")
                            .setFooter(Format.footer.text, Format.footer.image);
            
                        bot.channels.cache.get(Channels.devCmds).send(reset).catch(err => ErrorLog.log(bot, msg, `dev command reset: successful reset message of ${mention}`, err));
        
                    } catch (err) {
                        ErrorLog.log(bot, msg, `dev command reset: ${mention}`, err);
                    }

                // invalid ID error
                } else {
                    msg.channel.send(ErrorLog.accountError(userID)).catch(err => ErrorLog.log(bot, msg, `dev command edit [not in db response]`, err));
                }

            // bad inputs error
            } else {
                msg.channel.send(ErrorLog.badInputError(args)).catch(err => ErrorLog.log(bot, msg, `dev command edit [bad input reseponse]`, err));
            }
        
        // not dev error
        } else {
            msg.channel.send(ErrorLog.ownerError()).catch(err => ErrorLog.log(bot, msg, "dev command reset [not dev response]", err));
        }
    }
}