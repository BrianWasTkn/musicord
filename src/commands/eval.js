import { inspect } from 'util';
import Command from '../classes/Command.js';

export default new Command({
	name: 'eval',
	aliases: ['e'],
	description: 'Evaluate arbitrary javascript code.',
	permissions: ['ADMINISTRATOR'],
	usage: '<...code>',
	cooldown: 3e3
}, async (bot, message, args) => {

	// pre-eval
	const code = args.join(" ");
	if (!code) return;
	const asynchronous = code.includes('return') || code.includes('await');
	let result, evalTime, type;

	try {
		// if evaled is an asynchronous function or not
		let before = Date.now()
		let evaled = await eval(asynchronous ? `(async()=>{${code}})()` : code);
		evalTime = Date.now() - before
		type = typeof evaled;

		// non-string eval
		if (typeof evaled !== "string") {
			evaled = inspect(evaled, { depth: 0 });
		}

		// clean our output + hide our token
		result = bot.utils.sanitize(evaled);
		const token = new RegExp(bot.config.token, 'gi');
    result = result.replace(token, 'e');
	} catch (e) {
		result = e.message
	}

	return {
		hexColor: 'RANDOM',
		description: bot.utils.codeBlock(result, 'js'),
		fields: [
			{ name: 'Type', value: bot.utils.codeBlock(type, 'js') }
		],
		footer: {
			text: evalTime === 0 ? "Evaluation is fast" : `Eval Time: ${evalTime}ms`
		}
	}

})