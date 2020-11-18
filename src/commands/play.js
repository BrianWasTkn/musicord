import Command from '../classes/Command.js'
import { log } from '../utils/logger.js'

export default new Command({
	name: 'play',
	aliases: ['p'],
	description: 'play a song from soundcloud, youtube or from spotify and other sources.',
	usage: '<...query: any | playlistURL: any | videoURL: any>',
	cooldown: 5e3,
	music: true
}, async (bot, message, args) => {

	/** Missing Args (Bug?) */
	if (args.length < 1) {
		return 'you need something to play.'
	}

	/** Play */
	try {
		const sIndex = args.indexOf('--skip'),
		rIndex = args.indexOf('--related');

		if (args.length > (sIndex + 1)) {
			/** Play Skip */
			args.splice(sIndex, 2); // removes the flag from the args array
			await bot.player.playSkip(message, args.join(' '));
		} else if (args.length > rIndex) {
			/** Add related song */
			args.splice(rIndex, 2); // removes the flag from the args array
			await bot.player.addRelatedVideo(message);
		} else {
			/** Play Song */
			await bot.player.play(message, args.join(' ')) ;
		}
	} catch(error) {
		log('commandError', 'play', error)
		return error;
	}
})