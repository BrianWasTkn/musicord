import distube from 'distube'

class Player extends distube {
	constructor(client, options) {
		super(client, options);
	}

	/**
	 * DisTube#nowplaying - extra function added by: BrianWasTkn
	 * Resolves: first song in queue.
	 * @param {Object} message Discord.Message
	 */
	nowPlaying(message) {
		const queue = super.getQueue(message);
		if (!queue) return new Error('NotPlaying');
		return queue.songs[0];
	}

	/**
	 * DisTube#mapQueue - extra function added by: BrianWasTkn
	 * Resolves: An array of decorated song items.
	 * @param {Object} message Discord.Message
	 */
	mapQueue(message, filterFirst = false) {
		const queue = super.getQueue(message);
		if (!queue) return new Error('NotPlaying');
		const mapped = queue.songs.map((song, index) => {
			return `**${filterFirst ? index === 0 ? ':musical_note:' : `#${index + 1}` : `#${index + 1}`}:** [__${song.name}__](${song.url}) - \`${song.formattedDuration}\``
		});
		return mapped;
	}

	/**
	 * DisTube#remove - extra method added by: BrianWasTkn
	 * Resolves: the queue.
	 * @param {Object} message Discord.Message object
	 * @param {Number} index the index of the song in the queue
	 */
	remove(message, index) {
		return new Promise((resolve, reject) => {
			/* Fetch */
			let queue = super.getQueue(message);
			if (!queue) reject('NotPlaying');
			/* Invalid Num or Empty */
			index = parseInt(index, 10);
			if (isNaN(index) || !index) reject('Invalid/Empty_Number');
			/* Song Length */
			if (index > queue.songs.length) reject('TooHigh');
			if (index < 1) reject('TooLow');
			/* Index */
			if (!queue.songs[index]) reject('Unknown Song');
			/* Song */
			let song = queue.songs[index];
			if (!song) reject('NoSongIndex');
			queue.songs = queue.songs.filter(song => song !== queue.songs[index]);
			/* Resolve */
			resolve(queue);
		})
	}
}

export default Player;