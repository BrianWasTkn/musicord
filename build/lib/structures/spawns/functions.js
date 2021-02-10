"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const model_1 = __importDefault(require("./model"));
function dbSpawn(client) {
    return ({
        create: async (userID) => {
            const user = client.users.cache.get(userID);
            const data = new model_1.default({ userID: user.id });
            await data.save();
            return data;
        },
        fetch: async (userID) => {
            const data = await model_1.default.findOne({ userID });
            if (!data) {
                const newData = await dbSpawn(client).create(userID);
                return newData;
            }
            else {
                return data;
            }
        },
        addUnpaid: async (userID, amount) => {
            const data = await dbSpawn(client).fetch(userID);
            data.unpaid += amount;
            await data.save();
            return data;
        },
        removeUnpaid: async (userID, amount) => {
            const data = await dbSpawn(client).fetch(userID);
            data.unpaid -= amount;
            await data.save();
            return data;
        },
        incrementJoinedEvents: async (userID, amount) => {
            const data = await dbSpawn(client).fetch(userID);
            data.eventsJoined += amount || 1;
            await data.save();
            return data;
        },
        decrementJoinedEvents: async (userID, amount) => {
            const data = await dbSpawn(client).fetch(userID);
            data.eventsJoined -= amount || 1;
            await data.save();
            return data;
        }
    });
}
exports.default = dbSpawn;
