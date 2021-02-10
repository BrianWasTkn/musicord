"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const util_1 = require("./util");
const model_1 = __importDefault(require("./model"));
/**
 * Callable functions for our currency plugin.
 * @param client An extended instance of AkairoClient
 */
function dbCurrency(client) {
    return ({
        util: util_1.utils,
        /**
         * create a new document in db
         * @param userID the user id
         */
        create: async (userID) => {
            const user = await client.users.fetch(userID);
            const data = new model_1.default({ userID: user.id });
            await data.save();
            return data;
        },
        /**
         * Fetch the user's data from mongodb
         * @param userID A Discord User ID
         */
        fetch: async (userID) => {
            const data = await model_1.default.findOne({ userID });
            if (!data) {
                const newDat = await dbCurrency(client).create(userID);
                return newDat;
            }
            else {
                return data;
            }
        },
        /**
         * Add an amount to user's pocket
         * @param userID A Discord User ID
         * @param amount the amount to be added
         */
        addPocket: async (userID, amount) => {
            const data = await dbCurrency(client).fetch(userID);
            data.pocket += amount;
            await data.save();
            return data;
        },
        /**
         * Remove an amount to user's pocket
         * @param userID A Discord User ID
         * @param amount the amount to be deducted
         */
        removePocket: async (userID, amount) => {
            const data = await dbCurrency(client).fetch(userID);
            data.pocket -= amount;
            await data.save();
            return data;
        },
        /**
         * add amount to user's vault
         * @param userID user id
         * @param amount amount to be added
         */
        addVault: async (userID, amount) => {
            const data = await dbCurrency(client).fetch(userID);
            data.vault += amount;
            await data.save();
            return data;
        },
        /**
         * remov amount to user's vault
         * @param userID user id
         * @param amount amount to be removed
         */
        removeVault: async (userID, amount) => {
            const data = await dbCurrency(client).fetch(userID);
            data.vault -= amount;
            await data.save();
            return data;
        },
        /**
         * add something into user's bank space
         * @param userID a user id
         * @param amount the amount to be added
         */
        addSpace: async (userID, amount) => {
            const data = await dbCurrency(client).fetch(userID);
            data.space += amount;
            await data.save();
            return data;
        },
        /**
         * remove something into user's bank space
         * @param userID a user id
         * @param amount the amount to be removed
         */
        removeSpace: async (userID, amount) => {
            const data = await dbCurrency(client).fetch(userID);
            data.space -= amount;
            await data.save();
            return data;
        },
        /**
         * add multis
         * @param userID a user id
         * @param amount the amount to be added
         */
        addMulti: async (userID, amount) => {
            const data = await dbCurrency(client).fetch(userID);
            data.multi += amount;
            await data.save();
            return data;
        },
        /**
         * rem mult
         * @param userID user id - im honestly tired of typing this shityy jsdoc
         * @param amount amt to be dded
         */
        removeMulti: async (userID, amount) => {
            const data = await dbCurrency(client).fetch(userID);
            data.multi -= amount;
            await data.save();
            return data;
        }
    });
}
exports.default = dbCurrency;
