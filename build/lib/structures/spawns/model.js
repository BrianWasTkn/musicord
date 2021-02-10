"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
exports.default = mongoose_1.model('spawn-profile', new mongoose_1.Schema({
    userID: { type: String, required: true },
    unpaid: { type: Number, required: false, default: 0 },
    eventsJoined: { type: Number, required: false, default: 0 },
}));
