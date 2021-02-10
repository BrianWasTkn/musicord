"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_akairo_1 = require("discord-akairo");
class SpawnListener extends discord_akairo_1.Listener {
    constructor() {
        super('spawn-messageStart', {
            event: 'messageStart',
            emitter: 'spawnHandler'
        });
    }
    async exec(handler, spawner, message, str) {
        const { spawn } = spawner;
        const msg = await message.channel.send([
            `**${spawn.emoji} \`${spawn.type} EVENT WOO HOO!\`**`,
            `**${spawn.title}**`, spawn.description
        ].join('\n'));
        await message.channel.send(`Type \`${str.split('').join('\u200b')}\``);
        handler.queue.set(message.channel.id, {
            msgId: msg.id, spawn: spawner,
            channel: message.channel,
        });
    }
}
exports.default = SpawnListener;
