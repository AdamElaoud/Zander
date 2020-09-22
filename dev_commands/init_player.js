const Discord = require("discord.js");
const Channels = require("../util/channels.js");
const Config = require("../util/config.js");
const Emojis = require("../util/emojis.js");
const ErrorLog = require("../util/errors.js");
const Format = require("../util/format.js");
const Init = require("../database/init_user.js");

module.exports = {
    name: "init_player",
    description: "dev command: initialize player data document",
    async execute(bot, msg, args) {
        // react to command
        msg.react(bot.emojis.cache.get(Emojis.zander.id));

        // allow usage only if user is the owner
        if (msg.author.id === Config.owner.id) {
            const regex = /[0-9]{18}/g; // regex to isolate 18 digits of Discord ID
            const id = args[0].match(regex)[0];
            const mention = `<@${id}>`;
            let success = false;

            if (id !== null) {
                try {
                    success = await Init.execute(bot, msg, id);

                    // if the user was initialized
                    if (success) {
                        const init = new Discord.MessageEmbed()
                            .setColor("#55ACEE")
                            .setTitle(":busts_in_silhouette: **━━━ PLAYER INITIALIZED ━━━** :busts_in_silhouette:")
                            .setDescription(`Successfully initialized user: ${mention}`)
                            .addField("\u200b", "\u200b")
                            .setFooter(Format.footer.text, Format.footer.image);
            
                        bot.channels.cache.get(Channels.devCmds).send(init).catch(err => ErrorLog.log(bot, msg, `sending successful init message of ${mention} init`, err));
                    } else {
                        const init = new Discord.MessageEmbed()
                            .setColor("#55ACEE")
                            .setTitle(":busts_in_silhouette: **━━━ PLAYER ALREADY EXISTS ━━━** :busts_in_silhouette:")
                            .setDescription(`Player, ${mention}, already exists in the database`)
                            .addField("\u200b", "\u200b")
                            .setFooter(Format.footer.text, Format.footer.image);
            
                        bot.channels.cache.get(Channels.devCmds).send(init).catch(err => ErrorLog.log(bot, msg, `sending pre-existing player message for ${mention} init`, err));
                    }
    
                } catch (err) {
                    ErrorLog.log(bot, msg, `dev command: initializing player ${mention}`, err)
                }

            } else {
                const error = new Discord.MessageEmbed()
                    .setColor("#DD2E44")
                    .setTitle(":exclamation: **━━━━━ ERROR ━━━━━** :exclamation:")
                    .setDescription(`You did not enter a correct user ID!`
                                    + `\nYou entered: **${args[0]}**`)
                    .addField("\u200b", "\u200b")
                    .setFooter(Format.footer.text, Format.footer.image);

                msg.channel.send(error).catch(err => ErrorLog.log(bot, msg, "ping [not dev response]", err));
            }

        } else {
            const error = new Discord.MessageEmbed()
                .setColor("#DD2E44")
                .setTitle(":exclamation: **━━━━━ ERROR ━━━━━** :exclamation:")
                .setDescription(`You must be the bot owner, ${Config.owner.pub}, to use this command!`)
                .addField("\u200b", "\u200b")
                .setFooter(Format.footer.text, Format.footer.image);

            msg.channel.send(error).catch(err => ErrorLog.log(bot, msg, "ping [not dev response]", err));
        }
    }
}