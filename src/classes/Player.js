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
		const queue = this.guildQueues.get(message.guild.id);
		if (!queue) return new Error('Not Playing');
		return queue.songs[0];
	}

	/**
	 * DisTube#mapQueue - extra function added by: BrianWasTkn
	 * Resolves: An array of mapped song strings.
	 * @param {Object} message Discord.Message
	 */
	mapQueue(message) {
		const queue = super.getQueue(message);
		if (!queue) return new Error('NotPlaying');
		const mapped = queue.songs.map((song, index) => `**#${index + 1}:** [__${song.name}__](${song.url}) - \`${song.formattedDuration}\``);
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
			let queue = super.getQueue(message);
			if (!queue) reject('NoQueue');
			if (isNaN(index) || !index) reject('Invalid/Empty_Number');
			else if (index > queue.songs.length) reject('TooHigh');
			else if (index < 1) reject('TooLow');
			let song = queue.songs[index];
			if (!song) reject('NoSongIndex');
			queue = queue.songs.filter(s => s !== song);
			resolve(queue);
		})
	}
}

export default Player;