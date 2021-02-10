"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const discord_akairo_1 = require("discord-akairo");
const mongoose_1 = __importDefault(require("mongoose"));
class Dev extends discord_akairo_1.Command {
    constructor() {
        super('top', {
            aliases: ['top', 't'],
            description: 'View global top leaderboards for both Currency and Spawns.',
            category: 'Dev',
            ownerOnly: true,
            args: [
                { id: 'type', type: 'string' },
                { id: 'amount', type: 'number' }
            ]
        });
    }
    map(docs, amount, key) {
        return docs
            .sort((a, b) => b[key] - a[key])
            .filter((m) => m[key] < Infinity).slice(0, amount)
            .map(async (m, i) => {
            const user = await this.client.users.fetch(m.userID);
            return (`${i + 1}. **${m[key].toLocaleString()}** - ${user.tag}`);
        });
    }
    async exec(_, args) {
        const { type = 'unpaids', amount = 10 } = args;
        const embed = new discord_js_1.MessageEmbed();
        let docs;
        if (['unpaid', 'unpaids', 'spawns', 'spawn'].includes(type)) {
            docs = await mongoose_1.default.models["spawn-profile"].find({});
            embed.setTitle('Top Unpaids').setColor('RANDOM')
                .setDescription((this.map(docs, amount, 'unpaid')).join('\n'));
        }
        else if (['pocket', 'wallet'].includes(type)) {
            docs = await mongoose_1.default.models["currency"].find({});
            embed.setTitle('Top Pockets').setColor('RANDOM')
                .setDescription((this.map(docs, amount, 'pocket')).join('\n'));
        }
        return _.channel.send({ embed });
    }
}
exports.default = Dev;
