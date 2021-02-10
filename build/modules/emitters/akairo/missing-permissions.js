"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const discord_akairo_1 = require("discord-akairo");
class CommandListener extends discord_akairo_1.Listener {
    constructor() {
        super('missingPermissions', {
            emitter: 'commandHandler',
            event: 'missingPermissions'
        });
    }
    async exec(_, command, type, missing) {
        type = type === 'client' ? 'I' : 'You';
        const description = [];
        description[0] = `${type} don\'t have enough permissions to run the \`${command.id}\` command.`;
        description[1] = `Ensure ${type} have the following permissions:`;
        const embed = new discord_js_1.MessageEmbed()
            .setDescription(description.join('\n')).setColor('RED')
            .addField(`Missing Permissions • ${missing.length}`, `\`${missing.join('`, `')}\``)
            .setFooter(this.client.user.username, this.client.user.avatarURL())
            .setTitle('Well rip, no perms.');
        return _.channel.send({ embed });
    }
}
exports.default = CommandListener;
