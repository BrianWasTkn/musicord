import { inspect } from 'util'
import { sanitize, codeBlock } from '../../utils/text.js'
import Command from '../../classes/Command/Owner.js'
import { 
	simpleEmbed,
	dynamicEmbed, 
	errorEmbed 
} from '../utils/embed.js'

export default new Command({
	name: 'eval',
	aliases: ['e'],
	description: 'Evaluate arbitrary javascript code.',
	usage: '<...code>'
}, async (bot, message, args) => {

	// Pre-evaluation
	const code = args.join(' ');
	const asynchronous = ['return', 'await'].includes(code);
	let before, evaled, evalTime, type, token, result;

	try {
		// Time and Eval
		before = Date.now();
		try {
			evaled = await eval(asynchronous ? `(async()=>{${code}})()` : code);
		} catch(error) {
			evaled = error;
		}
		evalTime = Date.now() - before;
		type = typeof evaled;

		// inspect
		if (type !== 'string') {
			try {
				evaled = inspect(evaled, { depth: 0 });
			} catch(error) {
				return error;
			}
		}

		// Clean the eval
		try {
			result = sanitize(evaled);
			token = new RegExp(bot.config.token, 'gi');
			result = result.replace(token, 'N0.T0K4N.4Y0U');
			// Return a message
			return dynamicEmbed({
				color: 'BLUE',
				description: codeBlock(result, 'js'),
				fields: {
					'Type': { content: codeBlock(type, 'js') }
				},
				footer: {
					text: `Evaluation took ${evalTime}ms`,
					icon: message.author.avatarURL()
				}
			})
		} catch(error) {
			return error;
		}

	} catch(error) {
		return error;
	}

})