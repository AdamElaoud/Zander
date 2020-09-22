require("dotenv-flow");
const ErrorLog = require("../util/errors.js");
const MongoDB = require("mongodb").MongoClient;

module.exports = {
    name: "init_user",
    description: "inititialize a user into the database",
    async execute(bot, msg, userID) {
        let success = false;

        // create database client
        const dbClient = new MongoDB(process.env.MONGOURI, { useUnifiedTopology: true });

        try {
            await dbClient.connect();
            const db = dbClient.db("ZanderDB");

            success = await new Promise((resolve, reject) => {
                let initialized = module.exports.init(bot, msg, db, userID);
                resolve(initialized);
                reject("failed to add player document to database");
            });

        } catch (err) {
            ErrorLog.log(bot, msg, `init_user <@${userID}>: connecting to database`, err);

        } finally {
            dbClient.close();
        }

        return success;
    },
    async init(bot, msg, db, userID) {
        const users = db.collection("users");

        try {
            // check if user is already in database
            let user = await users.findOne({ "_user" : parseInt(userID) });

            if (user !== null)
                return false;
            
            await users.insertOne(
                {
                    // BASE
                    "_user": parseInt(userID),
                    "_school": "none",
                    "_lvl": 1,
                    "_xp": 0,
                    "_patron": false,
                    // DEBUFFS
                    "debuffs": {
                        "beguiled": {
                            "val": false,
                            "caster": -1,
                            "start": -1,
                            "dur": -1
                        }
                    },
                    // GOLD
                    "gold": {
                        "_total": 0,
                        "bonus": {
                            "_perm": 0,
                            "start": -1,
                            "dur": -1,
                            "val": 0
                        },
                        "mult": {
                            "_perm": 0,
                            "start": -1,
                            "dur": -1,
                            "val": 0
                        }
                    },
                    // FISH
                    "fish": {
                        "_caught": 0, // ever caught
                        "_total": 0, // in inv
                        "bonus": {
                            "_perm": 0,
                            "start": -1,
                            "dur": -1,
                            "val": 0
                        },
                        "mult": {
                        "_perm": 0,
                        "start": -1,
                        "dur": -1,
                        "val": 0
                        },
                        "inv": [

                        ]
                    },
                    // REAGENTS
                    "reagents": {
                        "_collected": 0, // ever collected
                        "_total": 0, // in inv
                        "bonus": {
                            "_perm": 0,
                            "start": -1,
                            "dur": -1,
                            "val": 0
                        },
                        "mult": {
                        "_perm": 0,
                        "start": -1,
                        "dur": -1,
                        "val": 0
                        },
                        "inv": [
                            
                        ]
                    },
                    // TCs
                    "TCs": {
                        "_collected": 0, // ever collected
                        "_total": 0, // in inv
                        "bonus": {
                            "_perm": 0,
                            "start": -1,
                            "dur": -1,
                            "val": 0
                        },
                        "mult": {
                        "_perm": 0,
                        "start": -1,
                        "dur": -1,
                        "val": 0
                        },
                        "inv": [
                            
                        ]
                    },
                    "recipes": {
                        "_total": 0,
                        "inv": [

                        ]
                    },
                    "spells": {
                        "_total": 0,
                        "_storm": 0,
                        "_fire": 0,
                        "_ice": 0,
                        "_balance": 0,
                        "_life": 0,
                        "_death": 0,
                        "_myth": 0,
                        "_sun": 0,
                        "_moon": 0,
                        "_star": 0,
                        "learned": [

                        ]
                    },
                    "items": {
                        "_total": 0,
                        "inv": [
                            
                        ]
                    }
                }
            );

        } catch (err) {
            ErrorLog.log(bot, msg, `initializing user **<@${userID}>**`, err);
        }

        return true;
    }
}