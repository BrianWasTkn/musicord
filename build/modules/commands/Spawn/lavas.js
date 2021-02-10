"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_akairo_1 = require("discord-akairo");
const discord_js_1 = require("discord.js");
class Spawn extends discord_akairo_1.Command {
    constructor() {
        super('lavas', {
            aliases: ['lavas', 'unpaids', 'lvs'],
            channel: 'guild',
            description: 'Displays yours or someone else\'s lava unpaids',
            category: 'Spawn',
            cooldown: 5e3,
            args: [{
                    id: 'member', type: 'member',
                    default: (message) => message.member
                }]
        });
    }
    async exec(_, args) {
        const user = args.member;
        const data = await this.client.db.spawns.fetch(user.id);
        const embed = new discord_js_1.MessageEmbed({
            title: `${user.user.username}'s lavas`,
            color: 'RANDOM',
            description: [
                `**Unpaid Coins:** ${data.unpaid.toLocaleString()}`,
                `**Events Joined:** ${data.eventsJoined.toLocaleString()}`
            ].join('\n'),
            footer: {
                text: 'Payments may take long.'
            }
        });
        return _.channel.send({ embed });
    }
}
exports.default = Spawn;
