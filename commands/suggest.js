const Discord = require("discord.js");
const Channels = require("../util/channels.js");
const Emojis = require("../util/emojis.js");
const ErrorLog = require("../util/errors.js");
const Format = require("../util/format.js");
const Roles = require("../util/roles.js");

module.exports = {
    name: "suggest",
    description: "command: submit a suggestion for Zander",
    execute(bot, msg, args) {
        let date = new Date();

        // react to command
        msg.react(bot.emojis.cache.get(Emojis.zander.id));

        const suggestion = new Discord.MessageEmbed()
            .setColor("#FFD983")
            .setTitle(`:bulb:${Format.space(1)} **━━━━━━━━ SUGGESTION ━━━━━━━━** ${Format.space(1)}:bulb:`)
            .setDescription(`**Sent By:** ${msg.author}
                            **Date:** ${date.getMonth()}/${date.getDate()}/${date.getFullYear()}
                            **Time:** ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}
                            **Server:** "${msg.guild.name}" (ID: ${msg.guild.id})
                            \n**Suggestion:** ${args.join(" ")}`);

        bot.channels.cache.get(Channels.suggestion).send(suggestion).catch(err => ErrorLog.log(bot, msg, "command suggest [sending report]", err));
        bot.channels.cache.get(Channels.suggestion).send(Roles.dev.pub).catch(err => ErrorLog.log(bot, msg, "command suggest [notifying dev]", err));

        const response = new Discord.MessageEmbed()
            .setColor("#FFD983")
            .setTitle(`:bulb:${Format.space(1)} **━━━━━━━━ SUGGESTION ━━━━━━━━** ${Format.space(1)}:bulb:`)
            .setDescription(`*Thank you for contributing to improving Zander!* ${Format.space(1)}${Emojis.zander.pub}`
                            + `\n\n**Suggestion:**`
                            + `\n${args.join(" ")}`
                            + `\n\n\n:white_check_mark: **Sucessfully Submitted to [${Format.support.text}](${Format.support.link})!**`)
            .addField("\u200b", "\u200b")
            .addField("Like what you see?", `[**${Format.bot.text}**](${Format.bot.invite}) ${Emojis.zander.pub}`
                                        + `\n[**${Format.server.text}**](${Format.server.link}) ${Emojis.zander.pub}`)
            .setFooter(Format.footer.text, Format.footer.image);

        msg.channel.send(response).catch(err => ErrorLog.log(bot, msg, "command suggest [submission reply]", err));
    }
}