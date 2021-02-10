"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_akairo_1 = require("discord-akairo");
class Currency extends discord_akairo_1.Command {
    constructor() {
        super('gimme', {
            aliases: ['gimme'],
            channel: 'guild',
            description: 'Gives you a random amount of coins from 100k to 1m coins',
            category: 'Currency',
            cooldown: 5000,
        });
    }
    async exec(_) {
        const user = _.member;
        const amount = this.client.util.randomNumber(100, 1000) * 1000;
        await this.client.db.currency.addPocket(user.user.id, amount);
        return _.channel.send(`Successfully added **${amount.toLocaleString()}** coins to your pocket.`);
    }
}
exports.default = Currency;
