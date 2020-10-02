const Discord = require("discord.js");
const Channels = require("../util/channels.js");
const Config = require("../util/config.js");
const Emojis = require("../util/emojis.js");
const ErrorLog = require("../util/errors.js");
const Format = require("../util/format.js");
const UserDoc = require("../database/init_user.js");

module.exports = {
    name: "init",
    description: "dev command: initialize player data document",
    async execute(bot, msg, args) {
        // react to command
        msg.react(bot.emojis.cache.get(Emojis.zander.id));

        // allow usage only if user is the owner
        if (msg.author.id === Config.owner.id) {
            // if inputs are provided
            if (args.length !== 0) {
                const userID = Format.isolateID(args[0]);
                const mention = `<@${userID}>`;
                let success = false;

                // if valid userID provided
                if (userID !== null) {
                    try {
                        success = await UserDoc.init(bot, msg, userID);

                        // if the user was initialized
                        if (success) {
                            const init = new Discord.MessageEmbed()
                                .setColor("#55ACEE")
                                .setTitle(":busts_in_silhouette: **━━━ PLAYER INITIALIZED ━━━** :busts_in_silhouette:")
                                .setDescription(`Successfully initialized user: ${mention}`)
                                .addField("\u200b", "\u200b")
                                .setFooter(Format.footer.text, Format.footer.image);
                
                            bot.channels.cache.get(Channels.devCmds).send(init).catch(err => ErrorLog.log(bot, msg, `dev command init: successful init message of ${mention}`, err));
                        } else {
                            const init = new Discord.MessageEmbed()
                                .setColor("#55ACEE")
                                .setTitle(":busts_in_silhouette: **━━━ PLAYER ALREADY EXISTS ━━━** :busts_in_silhouette:")
                                .setDescription(`Player, ${mention}, already exists in the database`)
                                .addField("\u200b", "\u200b")
                                .setFooter(Format.footer.text, Format.footer.image);
                
                            bot.channels.cache.get(Channels.devCmds).send(init).catch(err => ErrorLog.log(bot, msg, `dev command init: pre-existing player message for ${mention}`, err));
                        }
        
                    } catch (err) {
                        ErrorLog.log(bot, msg, `dev command init: ${mention}`, err);
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
            msg.channel.send(ErrorLog.ownerError()).catch(err => ErrorLog.log(bot, msg, "dev command init [not dev response]", err));
        }
    }
}