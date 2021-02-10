"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_akairo_1 = require("discord-akairo");
class Module extends discord_akairo_1.AkairoModule {
}
class ModuleHandler extends discord_akairo_1.AkairoHandler {
    constructor(client, options) {
        super(client, options);
    }
}
exports.default = ModuleHandler;
