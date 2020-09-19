const Discord = require("discord.js");
const Channels = require("../util/channels.js");
const Emojis = require("../util/emoji.js");
const ErrorLog = require("../util/error.js");
const Format = require("../util/format.js");
const Roles = require("../util/roles.js");

module.exports = {
    name: "bug",
    description: "report a bug with Kiwi",
    execute(bot, msg, args) {
        let date = new Date();

        // react to command
        msg.react(bot.emojis.cache.get(Emojis.zander.id));

        const report = new Discord.MessageEmbed()
            .setColor("#8899A6")
            .setTitle(`:wrench:${Format.space(1)} **━━━━━━━━ BUG REPORT ━━━━━━━━** ${Format.space(1)}:wrench:`)
            .setDescription(`**Sent By:** ${msg.author}`
                            + `\n**Date:** ${date.getMonth()}/${date.getDate()}/${date.getFullYear()}`
                            + `\n**Time:** ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`
                            + `\n**Server:** "${msg.guild.name}" (ID: ${msg.guild.id})`
                            + `\n\n**Report:** ${args.join(" ")}`);

        bot.channels.cache.get(Channels.bugReport).send(report).catch(err => ErrorLog.log(bot, msg, "bug [sending report]", err));
        bot.channels.cache.get(Channels.bugReport).send(Roles.dev).catch(err => ErrorLog.log(bot, msg, "bug [notifying dev]", err));

        const response = new Discord.MessageEmbed()
            .setColor("#8899A6")
            .setTitle(`:wrench:${Format.space(1)} **━━━━━━━━ BUG REPORT ━━━━━━━━** ${Format.space(1)}:wrench:`)
            .setDescription(`*Thank you for contributing to improving Kiwi!* ${Format.space(1)}${Emojis.zander.pub}`
                            + `\n\n**Bug Report:**`
                            + `\n${args.join(" ")}`
                            + `\n\n\n:white_check_mark: **Sucessfully Submitted to [${Format.support.text}](${Format.support.link})!**`)
            .addField("\u200b", "\u200b")
            .addField("Like what you see?", `[**${Format.bot.text}**](${Format.bot.link}) ${Emojis.zander.pub}`
                                        + `\n[**${Format.server.text}**](${Format.server.link}) ${Emojis.zander.pub}`)
            .setFooter(Format.footer.text, Format.footer.image);

        msg.channel.send(response).catch(err => ErrorLog.log(bot, msg, "bug [submission reply]", err));
    }
}