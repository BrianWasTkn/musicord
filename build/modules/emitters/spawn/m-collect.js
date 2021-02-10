"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_akairo_1 = require("discord-akairo");
class SpawnListener extends discord_akairo_1.Listener {
    constructor() {
        super('spawn-messageCollect', {
            event: 'messageCollect',
            emitter: 'spawnHandler'
        });
    }
    async exec(handler, spawner, msg, isFirst) {
        spawner.answered.set(msg.author.id, msg.member.user);
        if (isFirst)
            return msg.react('<:memerGold:753138901169995797>');
        return msg.react(spawner.spawn.emoji);
    }
}
exports.default = SpawnListener;
