import { inspect } from 'util'
import { sanitize, codeBlock } from '../../utils/text.js'
import { log } from '../../utils/logger.js'
import Command from '../../classes/Command/Owner.js'
import { 
	dynamicEmbed, 
	errorEmbed 
} from '../../utils/embed.js'

export default new Command({
	name: 'eval',
	aliases: ['e'],
	description: 'Evaluate arbitrary javascript code.',
	usage: '<...code>'
}, async (bot, message, args) => {

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
			result = sanitize(evaled);
			token = new RegExp(bot.config.token, 'gi');
			result = result.replace(token, 'N0.T0K4N.4Y0U');
			/** return Message */
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
			log('commandError', 'eval@sanitization', error);
			return errorEmbed({ title: 'eval@sanitization', error: error });
		}

	} catch(error) {
		log('commandError', 'eval@main_command', error);
		return errorEmbed({ title: 'eval@main_command', error: error });
	}

})