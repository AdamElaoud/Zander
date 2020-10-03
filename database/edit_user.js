require("mongodb");
const MongoConnector = require("../util/mongo.js");
const ErrorLog = require("../util/errors.js");
const Levels = require("../game_data/levels.js");

module.exports = {
    name: "user data manipulation",
    description: "manipulate a user's data",
    async field(bot, msg, field, op, val, userID) { // wiz edit @user field+val,field=val,field._subfield+val
        const dbClient = MongoConnector.client();
        
        try {
            const db = await MongoConnector.connect(bot, msg, "ZanderDB", dbClient);
            const users = db.collection("users");

            // correct value typing
            if (field === "_patron" || field === "debuffs.beguiled.val") {
                val = (val === "true");
            } else if (field === "_xp") {
                module.exports.checkLevel(bot, msg, op, val, userID);
                // return, as checkLevel function updates level and xp as necessary
                return;
            } else if (field !== "_school") {
                val = parseInt(val);
            }
            

            // if action is set
            if (op === "=") {
                await users.findOneAndUpdate(
                    { "_user": userID },
                    {
                        $set: { [field]: val }
                    }
                );

            // otherwise, increment / decrement
            } else if (op === "+") {
                await users.findOneAndUpdate(
                    { "_user": userID },
                    {
                        $inc: { [field]: val }
                    }
                );
            } else {
                throw "operation was neither + nor =";
            }            

        } catch (err) {
            ErrorLog.log(bot, msg, `${field} **[${op}${val}]** to <@${userID}>`, err);

        } finally {
            dbClient.close();
        }
    },
    async element(bot, msg, field, op, val, userID) {
        const dbClient = MongoConnector.client();
        
        try {
            const db = await MongoConnector.connect(bot, msg, "ZanderDB", dbClient);
            const users = db.collection("users");

            // insert array elements here
            console.log(`inserting element ${field} **[${op}${val}]** to <@${userID}>`);

        } catch (err) {
            ErrorLog.log(bot, msg, `${field} **[${op}${val}]** to <@${userID}>`, err);

        } finally {
            dbClient.close();
        }
    },
    async checkLevel(bot, msg, op, val, userID){
        const dbClient = MongoConnector.client();
        
        try {
            const db = await MongoConnector.connect(bot, msg, "ZanderDB", dbClient);
            const users = db.collection("users");

            // collect current user data
            const user = await users.findOne({ "_user": userID });
            const level = user._lvl;
            const xp = user._xp;
            let remainingXP = 0;

            // set iterating values
            if (op === "+")
                remainingXP = xp + parseInt(val);
            else if (op === "=")
                remainingXP = parseInt(val);
            else
                throw `invalid operation provided: ${op}`

            let costToLevel = Levels.costs[level + 1];
            let newLevel = level;

            // if current xp meets level up requirements, level up and iterate
            while (remainingXP >= costToLevel) {
                newLevel++;
                remainingXP -= costToLevel;
                costToLevel = Levels.costs[newLevel + 1];
            }
            
            await users.findOneAndUpdate(
                { "_user": userID },
                { 
                    $set: {
                        ["_xp"]: remainingXP,
                        ["_lvl"]: newLevel
                    }
                }
            );

        } catch (err) {
            ErrorLog.log(bot, msg, `checking ${op}${val} xp for <@${userID}>`, err);

        } finally {
            dbClient.close();
        }
    }
}