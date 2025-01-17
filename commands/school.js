const Discord = require("discord.js");
require("mongodb");
const Emojis = require("../util/emojis.js");
const ErrorLog = require("../util/errors.js");
const Format = require("../util/format.js");
const MongoConnector = require("../util/mongo.js");
const UserDoc = require("../database/init_user.js");

module.exports = {
    name: "school",
    description: "command: set player school",
    async execute(bot, msg, args) {
        // if no school was entered, give school info page
        if (args.length !== 0) {
            const school = args[0].toLowerCase();

            // react to command
            msg.react(bot.emojis.cache.get(Emojis.zander.id));

            // check user input
            if (!module.exports.checkSchool(school)) {
                const error = new Discord.MessageEmbed()
                    .setColor("#DD2E44")
                    .setTitle(":exclamation: **━━━━━ ERROR ━━━━━** :exclamation:")
                    .setDescription(`You did not correctly enter a school!`
                                    + `\n**You Entered:** ${args.join(" ")}`
                                    + `\n\n**Schools:**`
                                    + `\n${Emojis.storm.pub}**:** Storm, ${Emojis.fire.pub}**:** Fire, ${Emojis.ice.pub}**:** Ice, `
                                    + `${Emojis.balance.pub}**:** Balance, ${Emojis.life.pub}**:** Life, ${Emojis.death.pub}**:** Death, `
                                    + `${Emojis.myth.pub}**:** Myth`)
                    .addField("\u200b", "\u200b")
                    .setFooter(Format.footer.text, Format.footer.image);

                msg.channel.send(error).catch(err => ErrorLog.log(bot, msg, msg.guild.id, "command school [bad input response]", err));
            
            } else {
                // create database client
                const dbClient = MongoConnector.client();
                
                try {
                    const db = await MongoConnector.connect(bot, msg, "ZanderDB", dbClient);
                    const users = db.collection("users");
        
                    let user = await users.findOne({ "_user" : msg.author.id });
                    
                    // if user is not in the database, add them
                    if (user === null)
                        await UserDoc.init(bot, msg, msg.author.id);

                    // if the user has already selected a school
                    if (user !== null && user._school !== "none") {
                        msg.channel.send(module.exports.schoolEmbed("already chosen"));

                    // set the users school
                    } else {
                        await users.findOneAndUpdate(
                            { "_user" : msg.author.id },
                            { 
                                $set: {
                                    "_school": school
                                }
                            }
                        );
                        
                        msg.channel.send(module.exports.schoolEmbed(school)).catch(err => ErrorLog.log(bot, msg, "command school [sending update message]", err));
                    }
        
                } catch (err) {
                    ErrorLog.log(bot, msg, `command school`, err);
                
                } finally {
                    dbClient.close();
                }
            }
    
        // if no school was entered, give school info page
        } else {
            const info = new Discord.MessageEmbed()
                .setColor("#9E3F3D")
                .setTitle(`${Emojis.book.pub} **━━━━━ WIZARD SCHOOLS ━━━━━** ${Emojis.book.pub}`)
                .setDescription(`\n\n**Schools:**`
                                + `\n${Emojis.storm.pub}**:** Storm, ${Emojis.fire.pub}**:** Fire, ${Emojis.ice.pub}**:** Ice, `
                                + `${Emojis.balance.pub}**:** Balance, ${Emojis.life.pub}**:** Life, ${Emojis.death.pub}**:** Death, `
                                + `${Emojis.myth.pub}**:** Myth`)
                .addField("\u200b", "\u200b")
                .setFooter(Format.footer.text, Format.footer.image);

            msg.channel.send(info).catch(err => ErrorLog.log(bot, msg, msg.guild.id, "command school [school info response]", err));
        }
    },
    checkSchool(school) {
        if (school !== "storm" && school !== "fire" && school !== "ice" && school !== "balance"
                && school !== "life" && school !== "death" && school !== "myth") 
            return false;

        return true;
    },
    schoolEmbed(school) {
        const schoolEmbed = new Discord.MessageEmbed()
            .setFooter(Format.footer.text, Format.footer.image);
                
        switch (school) {
            case "storm": 
                schoolEmbed.setColor("#662D91")
                    .setTitle(`${Emojis.storm.pub} **━━━━━ WELCOME DIVINER ━━━━━** ${Emojis.storm.pub}`)
                    .setDescription(`Welcome to the **School of Storm** ${Emojis.storm.pub} young Diviner!`)
                    .addField("Storm Magic", "Storm magic is all about ...");
                break;
            case "fire":
                schoolEmbed.setColor("#E4292D")
                        .setTitle(`${Emojis.fire.pub} **━━━━━ WELCOME PYROMANCER ━━━━━** ${Emojis.fire.pub}`)
                        .setDescription(`Welcome to the **School of Fire** ${Emojis.fire.pub} young Pyromancer!`)
                        .addField("Fire Magic", "Fire magic is all about ...");
                break;
            case "ice":
                schoolEmbed.setColor("#38CFFC")
                    .setTitle(`${Emojis.ice.pub} **━━━━━ WELCOME THAUMATURGE ━━━━━** ${Emojis.ice.pub}`)
                    .setDescription(`Welcome to the **School of Ice** ${Emojis.ice.pub} young Thaumaturge!`)
                    .addField("Ice Magic", "Ice magic is all about ...");
                break;
            case "balance":
                schoolEmbed.setColor("#F64640")
                    .setTitle(`${Emojis.balance.pub} **━━━━━ WELCOME SORCER ━━━━━** ${Emojis.balance.pub}`)
                    .setDescription(`Welcome to the **School of Balance** ${Emojis.balance.pub} young Sorcerer!`)
                    .addField("Balance Magic", "Balance magic is all about ...");
                break;
            case "life":
                schoolEmbed.setColor("#2AB36D")
                    .setTitle(`${Emojis.life.pub} **━━━━━ WELCOME THEURGIST ━━━━━** ${Emojis.life.pub}`)
                    .setDescription(`Welcome to the **School of Life** ${Emojis.life.pub} young Theurgist!`)
                    .addField("Life Magic", "Life magic is all about ...");
                break;
            case "death":
                schoolEmbed.setColor("#AEAEAE")
                    .setTitle(`${Emojis.death.pub} **━━━━━ WELCOME NECROMANCER ━━━━━** ${Emojis.death.pub}`)
                    .setDescription(`Welcome to the **School of Death** ${Emojis.death.pub} young Necromancer!`)
                    .addField("Death Magic", "Death magic is all about ...");
                break;
            case "myth":
                schoolEmbed.setColor("#F1DB5B")
                    .setTitle(`${Emojis.myth.pub} **━━━━━ WELCOME CONJURER ━━━━━** ${Emojis.myth.pub}`)
                    .setDescription(`Welcome to the **School of Myth** ${Emojis.myth.pub} young Conjurer!`)
                    .addField("Myth Magic", "Myth magic is all about ..."); 
                break;
            
            // user's school has already been set    
            default:
                schoolEmbed.setColor("#9E3F3D")
                    .setTitle(`${Emojis.book.pub} **━━━━━ SCHOOL ALREADY CHOSEN ━━━━━** ${Emojis.book.pub}`)
                    .setDescription(`It seems you've already selected your school young wizard!`)
                break;
        }

        return schoolEmbed.addField("\u200b", "\u200b");
    }
}