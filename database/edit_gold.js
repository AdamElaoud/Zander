require("mongodb");
const MongoConnector = require("../util/mongo.js");
const ErrorLog = require("../util/errors.js");

module.exports = {
    name: "user gold manipulation",
    description: "manipulate a user's gold amount",
    async gold(bot, msg, userID, action, change) {
        const dbClient = MongoConnector.client();
        
        try {
            const db = await MongoConnector.connect(bot, msg, "ZanderDB", dbClient);
            const users = db.collection("users");

            // if action is set
            if (action === "set") {
                await users.findOneAndUpdate(
                    { "_user": userID },
                    {
                        $set: { ["gold._total"]: change }
                    }
                );

            // otherwise, increment / decrement gold amount
            } else {
                await users.findOneAndUpdate(
                    { "_user": userID },
                    {
                        $inc: { ["gold._total"]: change }
                    }
                );
            }

        } catch (err) {
            ErrorLog.log(bot, msg, `${action} gold to <@${userID}>`, err);

        } finally {
            dbClient.close();
        }
    }
}