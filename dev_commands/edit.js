require("mongodb");
const Discord = require("discord.js");
const Channels = require("../util/channels.js");
const Config = require("../util/config.js");
const Edit = require("../database/edit_user.js");
const Emojis = require("../util/emojis.js");
const ErrorLog = require("../util/errors.js");
const Format = require("../util/format.js");
const DBMap = require("../database/db_map.js");

module.exports = {
    name: "edit",
    description: "edit a user's data",
    execute(bot, msg, args) { // wiz edit @user field+val,field=val,field._subfield+val
        // react to command
        msg.react(bot.emojis.cache.get(Emojis.zander.id));

        // allow usage only if user is the owner
        if (msg.author.id === Config.owner.id) {
            // if inputs are provided
            if (args.length === 2) {
                let success = true;

                // get user id
                const userID = Format.isolateID(args.shift());

                // if user is valid
                if (userID !== null)  {
                    // create commands array
                    const cmds = args.shift().split(/[,]/);
                    let completed = "";
                    
                    cmds.forEach(cmd => {
                        cmdArray = cmd.match(/[^+=]+|\+|\=/g);

                        if (cmdArray.length !== 3) {
                            ErrorLog.log(bot, msg, `dev command edit`, `error parsing ${cmd} for edit`);
                            success = false;
                            return;
                        }

                        const field = cmdArray[0];
                        const op = cmdArray[1];
                        const val = cmdArray[2];

                        if (DBMap.fields.includes(field))
                            Edit.field(bot, msg, field, op, val, userID);
                        else if (DBMap.arrays.includes(field))
                            Edit.element(bot, msg, field, op, val, userID);
                        else
                            ErrorLog.log(bot, msg, `dev command edit`, `field ${field} not listed in the database map`);

                        completed += `▫️${op}${field} ${val}\n`;
                    });

                    if (success && completed.length !== 0) {
                        const update = new Discord.MessageEmbed()
                            .setColor("#D1C600")
                            .setTitle(`📋 **━━━ PLAYER EDITED ━━━** 📋`)
                            .setDescription(`Successfully edited user: <@${userID}>`
                                            + `\n\n**completed edits:**`
                                            + `\n${completed}`)
                            .addField("\u200b", "\u200b")
                            .setFooter(Format.footer.text, Format.footer.image);

                        bot.channels.cache.get(Channels.devCmds).send(update).catch(err => ErrorLog.log(bot, msg, `dev command edit: successful edit message of <@${userID}>`, err));
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
            msg.channel.send(ErrorLog.ownerError()).catch(err => ErrorLog.log(bot, msg, `dev command edit [not dev response]`, err));
        }
    }
}