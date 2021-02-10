"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const discord_akairo_1 = require("discord-akairo");
class Currency extends discord_akairo_1.Command {
    constructor() {
        super('bal', {
            aliases: ['balance', 'bal'],
            channel: 'guild',
            description: 'Check yours or someone else\'s coin balance',
            category: 'Currency',
            cooldown: 1e3,
            args: [{
                    id: 'member', type: 'member',
                    default: (message) => message.member
                }]
        });
    }
    async exec(_, { member }) {
        const data = await this.client.db.currency.fetch(member.user.id);
        const embed = new discord_js_1.MessageEmbed({
            title: `${member.user.username}'s balance`,
            color: 'RANDOM',
            description: [
                `**Pocket:** ${data.pocket.toLocaleString()}`,
                `**Vault:** ${data.vault.toLocaleString()}/${data.space.toLocaleString()}`,
                `**Total:** ${(data.pocket + data.vault).toLocaleString()}`
            ].join('\n'),
            footer: {
                text: 'discord.gg/memer',
            }
        });
        return _.channel.send({ embed });
    }
}
exports.default = Currency;
