"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const util_1 = require("util");
const discord_akairo_1 = require("discord-akairo");
class Dev extends discord_akairo_1.Command {
    constructor() {
        super('eval', {
            aliases: ['eval', 'ev'],
            description: 'Evaluate custom code for you stupid dev',
            category: 'Dev',
            ownerOnly: true,
            args: [{
                    id: 'code', match: 'content'
                }]
        });
    }
    inspect(obj, options) {
        return util_1.inspect(obj, options);
    }
    codeBlock(str, lang = 'js') {
        return `\`\`\`${lang}\n${str}\n\`\`\``;
    }
    async exec(_, args) {
        const { guild, channel } = _;
        const code = args.code;
        const asynchronous = code.includes('await') || code.includes('return');
        let before, evaled, evalTime, type, token, result;
        const embed = await channel.send({ embed: {
                color: 'ORANGE',
                description: '```\nPreparing pro gamer move...\n```',
                footer: {
                    iconURL: this.client.user.avatarURL({ dynamic: true }),
                    text: this.client.user.username
                }
            } });
        before = Date.now();
        try {
            evaled = await eval(asynchronous ? `(async()=>{${code}})()` : code);
        }
        catch (error) {
            evaled = error.message;
        }
        evalTime = Date.now() - before;
        type = typeof evaled;
        if (type !== 'string') {
            evaled = this.inspect(evaled, { depth: 0 });
        }
        token = new RegExp(this.client.token, 'gi');
        evaled = evaled.replace(token, 'N0.T0K4N.4Y0U');
        return embed.edit({ embed: {
                color: 'ORANGE',
                description: this.codeBlock(evaled),
                fields: [
                    { name: 'Type', value: this.codeBlock(type) },
                    { name: 'Latency', value: this.codeBlock(`${evalTime}ms`) }
                ]
            } });
    }
}
exports.default = Dev;
