"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const model_1 = __importDefault(require("./model"));
function dbGiveaway(client) {
    return ({
        fetchAll: async () => {
            const __all = await model_1.default.find({});
            return __all;
        },
        fetchGiveaway: async (messageID) => {
            const fetched = await model_1.default.findOne({ messageID });
            return fetched;
        }
    });
}
exports.default = dbGiveaway;
