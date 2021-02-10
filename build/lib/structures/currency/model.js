"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
exports.default = mongoose_1.model('currency', new mongoose_1.Schema({
    userID: { type: String, required: false },
    // Balance
    pocket: { type: Number, required: false, default: 1000 },
    vault: { type: Number, required: false, default: 0 },
    space: { type: Number, required: false, default: 0 },
    multi: { type: Number, required: false, default: 5 },
    // Gambling
    won: { type: Number, required: false, default: 0 },
    lost: { type: Number, required: false, default: 0 },
    wins: { type: Number, required: false, default: 0 },
    loses: { type: Number, required: false, default: 0 },
    // Other
    items: { type: Array, required: false, default: [] },
    gifted: { type: Array, required: false, default: 0 },
    cooldowns: { type: Array, required: false, default: [] },
}));
