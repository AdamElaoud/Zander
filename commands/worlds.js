const Discord = require("discord.js");
const Emojis = require("../util/emojis.js");
const ErrorLog = require("../util/errors.js");
const Format = require("../util/format.js");

module.exports = {
    name: "worlds",
    description: "command: view worlds' data to gather reagents and gold",
    execute(bot, msg) {
        // react to command
        msg.react(bot.emojis.cache.get(Emojis.zander.id));
        
        const worlds = new Discord.MessageEmbed()
            .setColor("#9B98CA")
            .setTitle(`${Emojis.global.pub} **━━━━━━ WORLD PORTAL ━━━━━━** ${Emojis.global.pub}`)
            .setDescription(`**Use the reactions below to see the different worlds!**`)
            .addField("\u200b", "\u200b")
            .addField("\u200b", `[**${Format.server.text}**](${Format.server.link}) ${Emojis.zander.pub}`)
            .setFooter(Format.footer.text, Format.footer.image);
        
        msg.channel.send(worlds).catch(err => ErrorLog.log(bot, msg, "command scavenge [worlds display]", err));
    }
}