require("dotenv-flow");
const MongoDB = require("mongodb").MongoClient;
const Config = require("../util/config.js");
const ErrorLog = require("../util/errors.js");

module.exports = {
    name: "mongodb connector",
    description: "initialize db connection",
    async connect(bot, msg, dbName) {
        // create database client
        const dbClient = new MongoDB(process.env.MONGOURI, { useUnifiedTopology: true });

        try {
            await dbClient.connect();

            // if in devmode, connect to development database
            if (!Config.devmode)
                const db = dbClient.db(dbName);
            else
                const db = dbClinent.db("ZanderDev");

            return db;

        } catch (err) {
            ErrorLog.log(bot, msg, `MongoDB Connector: connecting to ${dbName}`, err);

        } finally {
            dbClient.close();
        }

        return null;
    }
}