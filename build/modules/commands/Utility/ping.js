"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const discord_akairo_1 = require("discord-akairo");
class Util extends discord_akairo_1.Command {
    constructor() {
        super('ping', {
            aliases: ['ping', 'pong'],
            channel: 'guild',
            description: 'Checks the average latency across all shards',
            category: 'Utility'
        });
    }
    async exec(_) {
        const { channel, client, guild } = _;
        const { id, ping } = guild.shard;
        const embed = new discord_js_1.MessageEmbed({
            title: guild.name,
            color: 'RED',
            description: '**Status:** Poking...',
            timestamp: Date.now(),
            footer: {
                iconURL: client.user.avatarURL({ dynamic: true }),
                text: client.user.username
            }
        });
        const msg = await channel.send({ embed });
        return msg.edit({ embed: new discord_js_1.MessageEmbed({
                title: guild.name,
                color: 'ORANGE',
                description: [
                    `**Shard ID:** ${id}`,
                    `**Latency:** \`${ping}ms\``,
                    `**Websocket:** \`${client.ws.ping}ms\``
                ].join('\n'),
                timestamp: Date.now(),
                footer: {
                    iconURL: client.user.avatarURL({ dynamic: true }),
                    text: client.user.username
                }
            }) });
    }
}
exports.default = Util;
