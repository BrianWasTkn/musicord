"use strict";
/**
 * Balance Command
 * Made by: BrianWasTkn
 */
Object.defineProperty(exports, "__esModule", { value: true });
const Command_1 = require("../../structures/Command");
exports.default = new Command_1.Command({
    name: 'balance',
    triggers: ['bal', 'coins']
}, ({ msg: { channel: { guild }, author } }) => ({
    type: 'rich',
    title: `${author.username}'s balance`,
    description: [
        '**Pocket:** 0',
        '**Vault:** 0/0',
        '**Total:** -1'
    ].join('\n'),
    footer: {
        text: `discord.gg/${guild.vanityURL || 'memer'}`,
        icon_url: guild.dynamicIconURL(guild.icon.startsWith('a_') ? 'gif' : 'png')
    }
}));
