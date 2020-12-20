const { Command } = require('discord-akairo');
const { inspect } = require('util');

module.exports = class UtilEval extends Command {
	constructor() {
		super('eval', {
			aliases: ['eval', 'e'],
			ownerOnly: true,
			typing: true,
			args: [
				{ id: 'code', type: 'content' }
			]
		});
	}

	inspect(string, options) {
		return inspect(string, options);
	}

	codeBlock(str, lang = 'js') {
		return [
			`\`\`\`${lang}`,
			str, '```'
		].join('\n');
	}

	async exec(message, args) {
		const code = args.code;
		const { guild, channel } = message;
		const asynchronous = code.includes('await') || code.includes('return');
		let before, evaled, evalTime, type, token, result;

		try {
			before = Date.now();
			evaled = await eval(asynchronous ? `(async () => { ${code} } )()` : code);
			evalTime = Date.now() - before;
			type = typeof evaled;
		} catch(error) {
			evaled = error.message;
		}

		if (type !== 'string') {
			evaled = this.inspect(evaled, { depth: 0 });
		}

		token = new RegExp(this.client.token, 'gi');
		evaled = evaled.replace(token, 'N0.T0K4N.4Y0U');
		await channel.send({ embed: {
			color: 'ORANGE',
			description: this.codeBlock(evaled),
			fields: [
				{ name: 'Type', value: this.codeBlock(type) },
				{ name: 'Latency', value: this.codeBlock(`${evalTime}ms`) }
			]
		}});
	}
}