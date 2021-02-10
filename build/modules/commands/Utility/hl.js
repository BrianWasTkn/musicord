"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_akairo_1 = require("discord-akairo");
class Util extends discord_akairo_1.Command {
    constructor() {
        super('hlock', {
            aliases: ['hlock', 'hl'],
            channel: 'guild',
            description: 'Locks the heist channel if you have proper permissions',
            category: 'Utility',
            userPermissions: ['MANAGE_MESSAGES']
        });
    }
    async exec(_) {
        await _.delete();
        const role = this.client.util.heists.get(_.channel.id);
        if (!role)
            return;
        const { channel } = _;
        await channel.updateOverwrite(role.id, { SEND_MESSAGES: null });
        return _.channel.send({ embed: {
                title: `**LOCKED FOR \`${role.name}\`**`,
                color: 'GREEN',
                footer: {
                    text: _.guild.name,
                    iconURL: _.guild.iconURL({ dynamic: true })
                }
            } });
    }
}
exports.default = Util;
