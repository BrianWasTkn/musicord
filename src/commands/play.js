import Command from '../classes/Command/Music.js'
import { log } from '../utils/logger.js'
import { 
	simpleEmbed, 
	generateErrorEmbed 
} from '../utils/embed.js'

export default new Command({
	name: 'play',
	aliases: ['p'],
	description: 'play a song from soundcloud, youtube or from spotify and other sources.',
	usage: '<...query | playlistURL | videoURL>'
}, async (bot, message, args) => {

	/** Missing Args */
	if (args.length < 1) {
		return simpleEmbed(message, 'You need something to play.');
	}

	/** Play */
	try {
		const sIndex = args.indexOf('--skip'),
		rIndex = args.indexOf('--related');

		if (args.length > (sIndex + 1)) {
			/** Play Skip */
			args.splice(sIndex, 2);
			await bot.player.playSkip(message, args.join(' '));
		} else if (args.length > rIndex) {
			/** Add related song */
			args.splice(rIndex, 2);
			await bot.player.addRelatedVideo(message);
		} else {
			/** Play Song */
			await bot.player.play(message, args.join(' ')) ;
		}
	} catch(error) {
		log('commandError', 'play@play', error.stack);
		return generateErrorEmbed(message, error);
	}
})