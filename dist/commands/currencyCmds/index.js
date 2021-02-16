"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = require("fs");
const path_1 = require("path");
const commands = fs_1.readdirSync(path_1.join(__dirname))
    .filter(f => !f.startsWith('index'))
    .map(f => require(path_1.join(__dirname, f)).default);
exports.default = {
    commands,
    name: 'Currency',
    description: 'Gamble, spend and do everything with your coins.'
};
