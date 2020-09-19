const Discord = require("discord.js");
const Channels = require("../util/channels.js");
const Confid = require("../util/config.js");
const Emojis = require("../util/emojis.js");
const ErrorLog = require("../util/errors.js");
const Format = require("../util/format.js");
const Roles = require("../util/roles.js");

module.exports = {
    name: "unrecognized",
    description: "default response if an unrecognized command is entered",
    execute(bot, msg, cmd) {
        // react to command
        msg.react(bot.emojis.cache.get(Emojis.zander.id));
        
        const embed = new Discord.MessageEmbed()
            .setColor("#DD2E44")
            .setTitle(":exclamation: **━━━━━ ERROR ━━━━━** :exclamation:")
            .setDescription(`Unrecognized command: **${cmd}**`
                            + `\n\nUse the **\`${Config.prefix}help\`** command for a list of Kiwi's commands`)
            .addField("\u200b", "\u200b")
            .addField("Like what you see?", `[**${Format.bot.text}**](${Format.bot.link}) ${Emojis.zander.id}`
                                        + `\n[**${Format.server.text}**](${Format.server.link}) ${Emojis.zander.id}`)
            .setFooter(Format.footer.text, Format.footer.image);

            msg.channel.send(embed).catch(err => ErrorLog.log(bot, msg, `unrecognized [${cmd}]`, err));
    }
}