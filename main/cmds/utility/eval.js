const { Util } = require('discord.js');
const { inspect } = require('util');
const Command = require('../../lib/command/Command.js');

function sanitize(str, opts) {
	return Util.escapeMarkdown(str, opts);
}

function codeBlock(str, lang = 'js') {
	return `\`\`\`${lang}\n${str}\n\`\`\``;
}

module.exports = new Command({
	name: 'eval',
	aliases: ['e'],
	userPerms: ['ADMINISTRATOR'],
	botPerms: ['EMBED_LINKS']
}, async ({ ctx, msg, args }) => {
	const { channel, guild } = msg;
	const code = args.join(' ');
	const asynchronous = code.includes('return') || code.includes('await');
	let before, evaled, evalTime, type, token, result;

	before = Date.now();
	try {
		evaled = await eval(asynchronous ? `(async()=>{${code}})()` : code);
	} catch(error) {
		evaled = error.message;
	}
	evalTime = Date.now() - before;
	type = typeof evaled;

	if (type !== 'string') {
		evaled = inspect(evaled, { depth: 0 });
	}

	result = sanitize(evaled, { italic: false });
	token = new RegExp(ctx.config.main.token, 'gi');
	result = result.replace(token, 'N0.T0K4N.4Y0U');
	await channel.send({ embed: {
		color: 'BLUE',
		description: codeBlock(result),
		fields: [
			{ name: 'Type', value: codeBlock(type) },
			{ name: 'Latency', value: codeBlock(`${evalTime}ms`) }
		]
	}}).catch(console.error);
})