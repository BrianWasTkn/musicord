"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_akairo_1 = require("discord-akairo");
class Currency extends discord_akairo_1.Command {
    constructor() {
        super('dev', {
            aliases: ['dev', 'g'],
            channel: 'guild',
            ownerOnly: true,
            category: 'Currency',
            cooldown: 1e3,
            args: [{
                    id: 'option',
                    type: 'string'
                }, {
                    id: 'amount',
                    type: 'number'
                }, {
                    id: 'user',
                    type: 'member'
                }]
        });
    }
    async exec(_, args) {
        const { option, amount, user } = args;
        if (['give', 'g', 'add'].includes(option)) {
            await this.client.db.currency.addPocket(user.user.id, amount);
            return _.channel.send(`Added **${amount.toLocaleString()}** to ${user.user.username}'s pocket.`);
        }
    }
}
exports.default = Currency;
