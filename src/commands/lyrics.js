import Command from '../classes/Command.js'
import { logError } from '../utils/logger.js'
import axios from 'axios'

export default new Command({
	name: 'lyrics',
	aliases: ['l'],
	description: 'view the lyrics of the current track.',
	usage: '[...songName]',
	cooldown: 3e3,
	music: true
}, async (bot, message, args) => {
	
	/** Check Playing State */
	const isPlaying = bot.player.isPlaying(message);
	if (!isPlaying) {
		return 'There\'s nothing playing in the queue.'
	}

	/** Request Headers */
	const queue = bot.player.getQueue(message);
	const options = {
	  method: 'GET',
	  url: 'https://shazam.p.rapidapi.com/auto-complete',
	  params: {
	  	term: queue.songs[0].name, 
	  	locale: 'en-US'
	  },
	  headers: {
	    'x-rapidapi-key': '2948dd87c1msh02e7cfdca24dc04p19ffb5jsn907344f5baf4',
	    'x-rapidapi-host': 'shazam.p.rapidapi.com'
	  }
	};

	/** Request Lyrics */
	try {
		const response = await axios.request(options);
		console.log(response);
		return 'done'
	} catch(error) {
		logError('Command', 'Unable to request lyrics', error)
	}

})