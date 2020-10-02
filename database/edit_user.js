require("mongodb");
const MongoConnector = require("../util/mongo.js");
const ErrorLog = require("../util/errors.js");


module.exports = {
    name: "user data manipulation",
    description: "manipulate a user's data",
    async field(bot, msg, field, op, val, userID) { // wiz edit @user field+val,field=val,field._subfield+val
        const dbClient = MongoConnector.client();
        
        try {
            const db = await MongoConnector.connect(bot, msg, "ZanderDB", dbClient);
            const users = db.collection("users");

            // correct value typing
            if (field === "_patron" || field === "debuffs.beguiled.val")
                val = (val === "true");
            else if (field !== "_school")
                val = parseInt(val);
            

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
            ErrorLog.log(bot, msg, `${op}${field} [${val}] to <@${userID}>`, err);

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
            console.log(`inserting element ${op}${field} [${val}] to <@${userID}>`);

        } catch (err) {
            ErrorLog.log(bot, msg, `${op}${field} [${val}] to <@${userID}>`, err);

        } finally {
            dbClient.close();
        }
    }
}