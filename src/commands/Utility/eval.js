import { Command } from '../../lib/Command.js'
import { escapeMarkdown } from 'discord.js'
import { inspect } from 'util'

const codeBlock = (str, syn = 'js') => `\`\`\`${syn}\n${str}\n\`\`\``;

export default new Command({
	name: 'eval', 
	aliases: ['e'],
	permissions: ['ADMINISTRATOR']
}, async (msg) => {
	const { channel, guild } = msg;
	const code = msg.args.join(' ');
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

	result = escapeMarkdown(evaled, { italic: false });
	token = new RegExp(msg.client.token, 'gi');
	result = result.replace(token, 'N0.T0K4N.4Y0U');
	await channel.send({ embed: {
		color: 'BLUE',
		description: codeBlock(result),
		fields: [
			{ name: 'Type', value: codeBlock(type) },
			{ name: 'Latency', value: codeBlock(`${evalTime}ms`) }
		]
	}}).catch(console.error);
});