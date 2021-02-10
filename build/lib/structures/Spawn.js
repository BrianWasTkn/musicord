"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const discord_akairo_1 = require("discord-akairo");
class Spawn extends discord_akairo_1.AkairoModule {
    constructor(client, config, spawn, cooldown) {
        super(spawn.title, {
            category: 'spawner'
        });
        this.client = client;
        this.config = config;
        this.spawn = spawn;
        this.client = client;
        this.spawn = spawn;
        this.config = { ...config, cooldown };
        this.answered = new discord_js_1.Collection();
    }
}
exports.default = Spawn;
