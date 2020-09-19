const Discord = require("discord.js");
const Emojis = require("../util/emojis.js");
const ErrorLog = require("../util/errors.js");
const Format = require("../util/format.js");

module.exports = {
    name: "invite",
    description: "submit a suggestion for Kiwi",
    execute(bot, msg) {
        // react to command
        msg.react(bot.emojis.cache.get(Emojis.zander.id));
        
        const invite = new Discord.MessageEmbed()
            .setColor("#CCD6DD")
            .setTitle(`:envelope:${Format.space(1)} **━━━━━━ INVITE KIWI ━━━━━━** ${Format.space(1)}:envelope:`)
            .setDescription(`*Like what ya see?*`
                            + `\nHere's a link to invite Kiwi to **your server**!`
                            + `\n\n[**Invite Me!**](${Format.bot.link}) ${Emojis.zander.id}`)
            .addField("\u200b", "\u200b")
            .addField("\u200b", `[**${Format.server.text}**](${Format.server.link}) ${Emojis.zander.id}`)
            .setFooter(Format.footer.text, Format.footer.image);
        
        msg.channel.send(invite).catch(err => ErrorLog.log(bot, msg, "invite", err));
    }
}