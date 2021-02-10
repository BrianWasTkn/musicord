"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_akairo_1 = require("discord-akairo");
class Util extends discord_akairo_1.Command {
    constructor() {
        super('hunlock', {
            aliases: ['hunlock', 'hul'],
            channel: 'guild',
            userPermissions: ['MANAGE_MESSAGES'],
            description: 'Unlocks the heist channel if you have right permissions',
            category: 'Utility',
            args: [{
                    id: 'role', type: 'role'
                }, {
                    id: 'interval', type: 'number',
                    default: 10
                }]
        });
    }
    embed(display, role, color) {
        return {
            color: color || 'ORANGE',
            title: `**UNLOCKING IN \`${display}\` SECONDS**`,
            footer: {
                text: `Requirement: ${role.name}`,
                iconURL: role.guild.iconURL({ dynamic: true })
            }
        };
    }
    async exec(_, args) {
        await _.delete();
        const { role, interval } = args;
        if (!role)
            return;
        const { channel } = _;
        const msg = await channel.send({ embed: this.embed(60, role) });
        await this.client.util.sleep(interval * 1000);
        await msg.edit({ embed: this.embed(50, role) });
        await this.client.util.sleep(interval * 1000);
        await msg.edit({ embed: this.embed(40, role) });
        await this.client.util.sleep(interval * 1000);
        await msg.edit({ embed: this.embed(30, role) });
        await this.client.util.sleep(interval * 1000);
        await msg.edit({ embed: this.embed(20, role) });
        await this.client.util.sleep(interval * 1000);
        await msg.edit({ embed: this.embed(10, role) });
        await this.client.util.sleep(interval * 1000);
        await msg.edit({ embed: this.embed(3, role, 'RED') });
        await this.client.util.sleep(1 * 1000);
        await msg.edit({ embed: this.embed(2, role, 'RED') });
        await this.client.util.sleep(1 * 1000);
        await msg.edit({ embed: this.embed(1, role, 'RED') });
        await this.client.util.sleep(1 * 1000);
        await msg.edit({ embed: this.embed(0, role, 'GREEN') });
        const perms = { SEND_MESSAGES: true };
        _.channel.updateOverwrite(role.id, perms);
        this.client.util.heists.set(channel.id, role);
        return channel.send({ embed: {
                title: `**UNLOCKED FOR \`${role.name}\`**`,
                color: 'GREEN',
                footer: {
                    text: _.guild.name,
                    iconURL: _.guild.iconURL({ dynamic: true })
                }
            } });
    }
}
exports.default = Util;
