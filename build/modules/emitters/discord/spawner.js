"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_akairo_1 = require("discord-akairo");
class DiscordListener extends discord_akairo_1.Listener {
    constructor() {
        super('spawner', {
            emitter: 'client',
            event: 'message'
        });
    }
    async exec(message) {
        if (!this.client.config.spawns.enabled)
            return;
        if (message.author.bot || message.channel.type === 'dm')
            return;
        const spawner = this.client.spawnHandler.modules.random();
        const { unpaid } = await this.client.db.spawns.fetch(message.author.id);
        if (Math.round(Math.random() * 100) < (100 - spawner.config.odds))
            return;
        if (unpaid >= 10000000)
            return;
        const handler = this.client.spawnHandler;
        const { whitelistedCategories, blacklistedChannels } = this.client.config.spawns;
        if (handler.cooldowns.has(message.author.id))
            return;
        if (handler.queue.has(message.channel.id))
            return;
        if (blacklistedChannels.includes(message.channel.id))
            return;
        if (!whitelistedCategories.includes(message.channel.parentID))
            return;
        await handler.spawn(spawner, message);
    }
}
exports.default = DiscordListener;
