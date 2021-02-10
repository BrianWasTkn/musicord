"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_akairo_1 = require("discord-akairo");
class DiscordListener extends discord_akairo_1.Listener {
    constructor() {
        super('ready', {
            emitter: 'client',
            event: 'ready'
        });
    }
    async exec() {
        const activity = {
            name: 'discord.gg/memer',
            type: 'STREAMING',
            url: 'https://twitch.tv/badboyhaloislive'
        };
        await this.client.user.setPresence({ activity });
        const message = `${this.client.user.tag} has flown within Discord.`;
        return this.client.util.log('Discord', 'main', message);
    }
}
exports.default = DiscordListener;
