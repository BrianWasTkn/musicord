"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const discord_akairo_1 = require("discord-akairo");
const util_1 = require("util");
const programmatic_repl_1 = __importDefault(require("programmatic-repl"));
class Dev extends discord_akairo_1.Command {
    constructor() {
        super('repl', {
            aliases: ['repl'],
            description: 'Start a REPL session',
            category: 'Dev',
            ownerOnly: true,
        });
    }
    _codeBlock(str, lang = 'js') {
        return `\`\`\`${lang}\n${str}\n\`\`\``;
    }
    async _collect(_) {
        const filter = ({ author }) => author.id === _.author.id;
        const options = { max: 1, time: 600000 };
        const collected = await _.channel.awaitMessages(filter, options);
        return [...collected.values()][0];
    }
    async exec(_) {
        const REPL = new programmatic_repl_1.default({
            name: 'lava.repl',
            includeNative: true,
            includeBuiltinLibs: true,
            indentation: 4
        }, {
            lava: this.client,
            channel: _.channel,
            guild: _.guild, msg: _,
            db: this.client.db
        });
        // from https://dankmemer.lol/source and modified.
        const run = async (retry) => {
            if (!retry)
                await _.channel.send('Started a REPL session');
            const msg = await this._collect(_);
            if (msg.content.toLowerCase() === '.exit' || !msg.content) {
                return _.channel.send('Exiting REPL...');
            }
            REPL.ctx.msg = msg; // ts smfh
            let b;
            let a;
            let r;
            let t; // BABAHAHAHH
            try {
                b = process.hrtime();
                r = await REPL.execute(msg.content);
                a = process.hrtime(b);
                a = a[0]
                    ? `${(a[0] + a[1] / 1e9).toLocaleString()}s`
                    : `${(a[1] / 1e3).toLocaleString()}μs`;
            }
            catch (e) {
                const error = e.stack || e;
                r = typeof error === 'string' ? error : util_1.inspect(error, { depth: 1 });
            }
            t = typeof r;
            if (t !== 'string') {
                r = util_1.inspect(r, {
                    depth: +!(util_1.inspect(r, { depth: 1, showHidden: true }).length > 1900),
                    showHidden: true
                });
            }
            r = r.replace(new RegExp(this.client.token, 'gi'), 'yes');
            if (r.length > 1900) {
                r = r.slice(0, 1900).split('\n');
                r.pop();
                r = r.join('\n') + '\n\n...';
            }
            await msg.channel.send({
                embed: {
                    color: 'ORANGE',
                    description: this._codeBlock(r),
                    fields: [
                        { name: 'Type', value: this._codeBlock(t) },
                        { name: 'Latency', value: this._codeBlock(a) }
                    ]
                }
            });
            await run(true);
        };
        await run(false);
    }
}
exports.default = Dev;
