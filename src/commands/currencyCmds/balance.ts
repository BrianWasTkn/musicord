/**
 * Balance Command
 * Made by: BrianWasTkn
 */

import { Command } from '../../structures/Command'
import { Embed } from 'eris'

export default new Command({
    name: 'balance',
    triggers: ['bal', 'coins']
}, ({ msg: { channel: { guild }, author } }): Embed => ({
    type: 'rich',
    title: `${author.username}'s balance`,
    description: [
        '**Pocket:** 0',
        '**Vault:** 0/0',
        '**Total:** -1'
    ].join('\n'),
    footer: {
        text: `discord.gg/${guild.vanityURL || 'memer'}`,
        icon_url: guild.dynamicIconURL(
            guild.icon.startsWith('a_') ? 'gif' : 'png'
        )
    }
}));