"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
exports.default = mongoose_1.model('giveaway', new mongoose_1.Schema({
    _id: { type: String, required: true },
    channelID: { type: String, required: false },
    messageID: { type: String, required: false },
    giveaway: {
        default: { startTime: Date.now(), ended: false },
        required: false,
        type: {
            winnerCount: Number, host: String, prize: String,
            startTime: Number, endTime: Number, ended: Boolean
        }
    }
}));
