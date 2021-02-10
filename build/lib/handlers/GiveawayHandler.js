"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const events_1 = require("events");
const discord_js_1 = require("discord.js");
class GiveawayHandler extends events_1.EventEmitter {
    constructor(client) {
        super();
        this.client = client;
        this.giveaways = new discord_js_1.Collection();
    }
}
exports.default = GiveawayHandler;
