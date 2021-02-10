"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_akairo_1 = require("discord-akairo");
class Utility extends discord_akairo_1.Command {
    constructor() {
        super('help', {
            aliases: ['help', 'h'],
            channel: 'guild',
            description: 'Sends a whole list of commands, or per commands information if you specify one.',
            category: 'Utility',
            args: [{
                    id: 'query', type: 'command',
                    default: null
                }]
        });
    }
    mapCommands() {
        const commands = this.handler.modules.array();
        const categories = [...new Set(commands.map(c => c.categoryID))];
        return categories.map((c) => ({
            name: `${c} Commands — ${commands.filter(cmd => cmd.categoryID === c).map(c => c.aliases[0]).length}`, inline: false,
            value: `\`${commands.filter(cmd => cmd.categoryID === c).map(c => c.aliases[0]).join('`, `')}\``
        }));
    }
    async exec(_, args) {
        const command = args.query;
        if (!command) {
            const fields = this.mapCommands();
            return _.channel.send({ embed: {
                    title: 'Lava Commands',
                    thumbnail: { url: this.client.user.avatarURL() },
                    color: 'RED',
                    fields, footer: {
                        text: `${this.handler.modules.size} commands`,
                        iconURL: this.client.user.avatarURL()
                    }
                } });
        }
        if (args.query) {
            const command = args.query;
            return _.channel.send({ embed: {
                    color: 'ORANGE',
                    title: command.aliases[0],
                    description: command.description || 'No description provided',
                    fields: [{
                            name: 'Triggers',
                            value: command.aliases.join(', ')
                        }, {
                            name: 'Cooldown',
                            value: command.cooldown / 1000
                        }, {
                            name: 'Category',
                            value: command.categoryID
                        }]
                } });
        }
    }
}
exports.default = Utility;
