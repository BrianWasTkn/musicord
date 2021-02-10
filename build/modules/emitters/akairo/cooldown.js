"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const discord_akairo_1 = require("discord-akairo");
class CommandListener extends discord_akairo_1.Listener {
    constructor() {
        super('cooldown', {
            emitter: 'commandHandler',
            event: 'cooldown'
        });
    }
    async exec(_, command, remaining) {
        const description = [];
        description[0] = `You're currently on cooldown for the \`${command.id}\` command.`;
        description[1] = `Please wait **${(remaining / 1000).toFixed(2)}** seconds and try again.`;
        const embed = new discord_js_1.MessageEmbed()
            .setTitle('Oh shoot, on cooldown.').setColor('RED')
            .setDescription(description.join('\n'))
            .setFooter(this.client.user.username, this.client.user.avatarURL());
        return _.channel.send({ embed });
    }
}
exports.default = CommandListener;
