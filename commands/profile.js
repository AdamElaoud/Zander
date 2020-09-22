const Discord = require("discord.js");
require("dotenv-flow");
const MongoDB = require("mongodb").MongoClient;
const Emojis = require("../util/emojis.js");
const ErrorLog = require("../util/errors.js");
const Format = require("../util/format.js");
const Levels = require("../game_data/levels.js");

module.exports = {
    name: "profile",
    description: "command: view player's self profile",
    async execute(bot, msg, args) {
        // react to command
        msg.react(bot.emojis.cache.get(Emojis.zander.id));

        // create database client
        const dbClient = new MongoDB(process.env.MONGOURI, { useUnifiedTopology: true });

        // default to search for command issuer
        let id = msg.author.id;

        // if user entered member to search, search for them instead
        if (args.length !== 0)
            id = Format.isolateID(args[0]);

        try {
            await dbClient.connect();
            const db = dbClient.db("ZanderDB");
            const users = db.collection("users");

            let user = await users.findOne({ "_user": id });

            // if user exists in the database
            if (user !== null) {
                const discUser = await bot.users.fetch(user._user);
                let printout = module.exports.generateProfile(user, discUser);
                msg.channel.send(printout).catch(err => ErrorLog.log(bot, msg, "command profile [sending profile]", err));

            } else {
                const error = new Discord.MessageEmbed()
                    .setColor("#DD2E44")
                    .setTitle(":exclamation: **━━━━━ ERROR ━━━━━** :exclamation:")
                    .setDescription(`Whoops! Looks like <@${id}> hasn't created an account!`)
                    .addField("\u200b", "\u200b")
                    .setFooter(Format.footer.text, Format.footer.image);

                msg.channel.send(error).catch(err => ErrorLog.log(bot, msg, "command profile [not in db response]", err));
            }

        } catch (err) {
            ErrorLog.log(bot, msg, `command profile: connecting to database`, err);

        } finally {
            dbClient.close();
        }
    },
    generateProfile(user, discUser) {
        const profile = new Discord.MessageEmbed()
            .setDescription(module.exports.profileDesc(user))
            .setFooter(Format.footer.text, Format.footer.image)
            .setThumbnail(discUser.avatarURL());

            switch (user._school) {
                case "storm": 
                    profile.setColor("#662D91")
                        .setTitle(`${Emojis.storm.pub} **━━━━━ ${discUser.username}'s PROFILE ━━━━━** ${Emojis.storm.pub}`);
                    break;
                case "fire":
                    profile.setColor("#E4292D")
                            .setTitle(`${Emojis.fire.pub} **━━━━━ ${discUser.username}'s PROFILE ━━━━━** ${Emojis.fire.pub}`);
                    break;
                case "ice":
                    profile.setColor("#38CFFC")
                        .setTitle(`${Emojis.ice.pub} **━━━━━ ${discUser.username}'s PROFILE ━━━━━** ${Emojis.ice.pub}`);
                    break;
                case "balance":
                    profile.setColor("#F64640")
                        .setTitle(`${Emojis.balance.pub} **━━━━━ ${discUser.username}'s PROFILE ━━━━━** ${Emojis.balance.pub}`);
                    break;
                case "life":
                    profile.setColor("#2AB36D")
                        .setTitle(`${Emojis.life.pub} **━━━━━ ${discUser.username}'s PROFILE ━━━━━** ${Emojis.life.pub}`);
                    break;
                case "death":
                    profile.setColor("#AEAEAE")
                        .setTitle(`${Emojis.death.pub} **━━━━━ ${discUser.username}'s PROFILE ━━━━━** ${Emojis.death.pub}`);
                    break;
                case "myth":
                    profile.setColor("#F1DB5B")
                        .setTitle(`${Emojis.myth.pub} **━━━━━ ${discUser.username}'s PROFILE ━━━━━** ${Emojis.myth.pub}`);
                    break;
                
                // if user hasn't selected their school yet
                default:
                    profile.setColor("#9E3F3D")
                        .setTitle(`${Emojis.book.pub} **━━━━━ ${discUser.username}'s PROFILE ━━━━━** ${Emojis.book.pub}`);
                break;
            }       

            profile.addField("\u200b", `**Gold:** ${user.gold._total} ${Emojis.gold.pub}`, true)
                .addField("\u200b", `${Emojis.patreon.pub} **Patron:** ${user._patron ? "Yes" : "No"}`, true)
                .addField("\u200b", "\u200b", true)
                .addField("TCs", `${user.TCs._collected} 🃏 collected`, true)
                .addField("Fish", `${user.fish._caught} 🐟 caught`, true)
                .addField("\u200b", "\u200b", true)
                .addField("Spells", `${user.spells._total} ✨ learned`, true)
                .addField("Reagents", `${user.fish._caught} 🧪 collected`, true)
                .addField("\u200b", "\u200b", true)
                .addField("\u200b", "\u200b");

            return profile;
    },
    xpBar(xp, level) {
        const filled = "⬜";
        const empty = "🔳";
        const numberOfSegments = 7;
        let xpBar = "";

        const costToLevel = Levels.costs[level + 1];
        const percentComplete =100 *  xp / costToLevel;

        let i;
        for (i = 1; i <= numberOfSegments; i++) {
            if (i * 100 / numberOfSegments <= percentComplete)
                xpBar += filled;
            else
                xpBar += empty;
        }

        return xpBar;
    },
    profileDesc(user) {
        let description;

        switch (user._school) {
            case "storm":
                description = `**Level** ${user._lvl} 1️⃣ Diviner`;
                break;
            case "fire":
                description = `**Level** ${user._lvl} 1️⃣ Pyromancer`;
                break;
            case "ice":
                description = `**Level** ${user._lvl} 1️⃣ Thaumaturge`;
                break;
            case "balance":
                description = `**Level** ${user._lvl} 1️⃣ Sorcerer`;
                break;
            case "life":
                description = `**Level** ${user._lvl} 1️⃣ Theurgist`;
                break;
            case "death":
                description = `**Level** ${user._lvl} 1️⃣ Necromancer`;
                break;
            case "myth":
                description = `**Level** ${user._lvl} 1️⃣ Conjurer`;
                break;
            // if user hasn't selected their school yet
            default:
                description = `**Level** ${user._lvl} 1️⃣ Wizard`;
                break;
        }

        description += `\n\n**${user._xp}** / ${Levels.costs[user._lvl + 1]} XP to level ${user._lvl + 1}`
                        + `\n${module.exports.xpBar(user._xp, user._lvl)}`;

        return description;
    }
}