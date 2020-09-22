require("dotenv-flow");
const MongoDB = require("mongodb").MongoClient;
const ErrorLog = require("../util/errors.js");
const Init = require("../database/init_doc.js");

module.exports = {
    name: "reset_user",
    description: "reset a user in the database",
    async execute(bot, msg, userID) {
        // create database client
        const dbClient = new MongoDB(process.env.MONGOURI, { useUnifiedTopology: true });

        try {
            await dbClient.connect();
            const db = dbClient.db("ZanderDB");
            const users = db.collection("users");

            // delete user from database
            await users.findOneAndDelete({ "_user": userID });
            // reinitialize them with a new document
            await Init.execute(bot, msg, userID);

        } catch (err) {
            ErrorLog.log(bot, msg, `reset_user <@${userID}>`, err);

        } finally {
            dbClient.close();
        }
    }
}