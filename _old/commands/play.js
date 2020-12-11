import Command from '../classes/Command/Music.js'
import { log } from '../utils/logger.js'
import { 
	simpleEmbed, 
	errorEmbed 
} from '../utils/embed.js'

export default new Command({
	name: 'play',
	aliases: ['p'],
	description: 'play a song from soundcloud, youtube or from spotify and other sources.',
	usage: '<...query | playlistURL | videoURL>'
}, async (bot, message, args) => {

	/** Missing Args */
	if (args.length < 1) {
		return simpleEmbed({
			title: 'Missing Args',
			color: 'RED',
			text: 'You need something to play.'
		});
	}

	/** Play */
	try {
		const sIndex = args.indexOf('--skip'),
		rIndex = args.indexOf('--related');

		if (args.length > (sIndex + 1)) {
			/** Play Skip */
			args.splice(sIndex, 2);
			try {
				await bot.player.playSkip(message, args.join(' '));
			} catch(error) {
				log('commandError', 'play@playSkip', error.stack);
				return errorEmbed({ title: 'play@playSkip', error: error });
			}
		} else if (args.length > rIndex) {
			/** Add related song */
			try {
				await bot.player.addRelatedVideo(message);
			} catch(error) {
				log('commandError', 'play@addRelatedVideo', error.stack);
				return errorEmbed({ title: 'play@addRelatedVideo', error: error });
			}
			args.splice(rIndex, 2);
		} else {
			/** Play Song */
			try {
				await bot.player.play(message, args.join(' ')) ;
			} catch(error) {
				log('commandError', 'play@play', error.stack);
				return errorEmbed({ title: 'play@play', error: error });
			}
		}
	} catch(error) {
		log('commandError', 'play@main_command', error.stack);
		return errorEmbed({ title: 'play@main_command', error: error });
	}
})