"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const discord_akairo_1 = require("discord-akairo");
const path_1 = __importDefault(require("path"));
const dir = path_1.default.join(__dirname, 'shop');
const files = discord_akairo_1.AkairoHandler.readdirRecursive(dir);
exports.default = files.map((f) => {
    return require(path_1.default.join(dir, f));
});
