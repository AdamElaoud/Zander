const Discord = require("discord.js");
const Channels = require("../util/channels.js");
const Config = require("../util/config.js");
const Emojis = require("../util/emojis.js");
const ErrorLog = require("../util/errors.js");
const Format = require("../util/format.js");
const Gold = require("../database/edit_gold.js");
const MongoConnector = require("../util/mongo.js");

module.exports = {
    name: "gold",
    description: "dev command: add gold to user account",
    async execute(bot, msg, args, effect) {
        // react to command
        msg.react(bot.emojis.cache.get(Emojis.zander.id));

        // allow usage only if user is the owner
        if (msg.author.id === Config.owner.id) {
            // parse input
            const amount = parseInt(args[1]);
            const id = Format.isolateID(args[0]);
            const mention = `<@${id}>`;

            // if input is valid
            if (!isNaN(amount) && id !== null) {

                // create database client
                const dbClient = MongoConnector.client();

                try {
                    const db = await MongoConnector.connect(bot, msg, "ZanderDB", dbClient);
                    const users = db.collection("users");

                    let user = await users.findOne({ "_user": id });

                    // if user exists in the database
                    if (user !== null) {
                        Gold.gold(bot, msg, id, effect, amount);

                        const gold = new Discord.MessageEmbed()
                            .setColor("#D1C600")
                            .setTitle(`${Emojis.gold.pub} **━━━ GOLD ${effect.toUpperCase()} ━━━** ${Emojis.gold.pub}`)
                            .setDescription(`Successfully **${effect}** ${amount.toLocaleString()} gold on user: ${mention}`)
                            .addField("\u200b", "\u200b")
                            .setFooter(Format.footer.text, Format.footer.image);

                        bot.channels.cache.get(Channels.devCmds).send(gold).catch(err => ErrorLog.log(bot, msg, `dev command ${effect} gold: successful +gold message of ${mention}`, err));        
        
                    // if user not in database
                    } else {
                        msg.channel.send(ErrorLog.accountError(id)).catch(err => ErrorLog.log(bot, msg, `dev command ${effect} gold [not in db response]`, err));
                    }

                } catch (err) {
                    ErrorLog.log(bot, msg, `dev command ${effect} gold: connecting to database`, err);
        
                } finally {
                    dbClient.close();
                }
            
            // if input is invalid
            } else {
                const error = new Discord.MessageEmbed()
                    .setColor("#DD2E44")
                    .setTitle(":exclamation: **━━━━━ ERROR ━━━━━** :exclamation:")
                    .setDescription(`You did not give the correct inputs`
                                    + `\nYou entered: **${args}**`)
                    .addField("\u200b", "\u200b")
                    .setFooter(Format.footer.text, Format.footer.image);

                msg.channel.send(error).catch(err => ErrorLog.log(bot, msg, `dev command ${effect} gold [NaN error]`, err));
            }
        }
    }
}