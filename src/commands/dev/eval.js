import Command from '../../classes/Command.js'
import { Util } from 'discord.js'
import { inspect } from 'util'

export default class Eval extends Command {
	constructor(client) {
		super(client, {
			name: 'eval',
			aliases: ['e'],
			description: 'Evaluate some jabaskrip code for your own brain.',
			usage: '<...code>',
			cooldown: 0
		}, {
			category: 'Developer'
		});
	}

	codeBlock(str, syn) {
		return `\`\`\`${syn}\n${str}\n\`\`\``;
	}

	sanitize(str) {
		return Util.escapeMarkdown(str);
	}

	async execute({ Bot, msg, args }) {
		/** Pre-eval */
		const code = args.join(' ');
		const asynchronous = ['return', 'await'].includes(code);
		let before, evaled, evalTime, type, token, result;

		try {
			/** Eval and Eval duration */
			before = Date.now();
			try {
				evaled = await eval(asynchronous ? `(async()=>{${code}})()` : code);
			} catch(error) {
				evaled = error;
			}
			evalTime = Date.now() - before;
			type = typeof evaled;

			/** Format Objects/Functions */
			if (type !== 'string') {
				try {
					evaled = inspect(evaled, { depth: 0 });
				} catch(error) {
					evaled = error;
				}
			}

			/** The Thing */
			try {
				/** Hide token */
				result = this.sanitize(evaled);
				token = new RegExp(Bot.config.token, 'gi');
				result = result.replace(token, 'N0.T0K4N.4Y0U');
				/** return Message */
				await msg.channel.send(super.createEmbed({
					color: 'BLUE',
					text: this.codeBlock(result),
					fields: {
						'Type': { content: this.codeBlock(type) },
						'Latency': { content: this.codeBlock(`${evalTime}ms`) }
					}
				}));
			} catch(error) {
				super.log('eval@sanitize', error);
			}
		} catch(error) {
			super.log('eval', error);
		}
	}
}