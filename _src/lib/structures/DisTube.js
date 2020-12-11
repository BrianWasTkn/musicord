import distube from 'distube'
import Discord from 'discord.js'

/**
 * Extends a distube class
 * @class DisTube @extends {distube}
 */
export default class DisTube extends distube {
	constructor(client, options) {
		super(client, options);
	}

	/**
	 * DisTube#nowplaying - extra function added by: BrianWasTkn
	 * @param {Discord.Message} message Discord.Message
	 * @returns {distube.Song} A distube song
	 */
	nowPlaying(message) {
		const queue = super.getQueue(message);
		if (!queue) return new Error('NotPlaying');
		return queue.songs[0];
	}

	/**
	 * DisTube#mapQueue - extra function added by: BrianWasTkn
	 * @param {Discord.Message} message a Discord.Message object
	 * @param {Boolean} filterFirst if add an emote to filter the first song
	 * @returns {Array<String>} an array of mapped song strings
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
	 * @param {Discord.Message} message Discord.Message object
	 * @param {Number} index the index of the song in the queue
	 * @returns {Promise<distube.Queue>} the new order of songs in queue.
	 */
	remove(message, index) {
		/* Fetch */
		let queue = super.getQueue(message);
		if (!queue) Promise.reject('NotPlaying');
		/* Invalid Num or Empty */
		index = parseInt(index, 10);
		if (isNaN(index) || !index) Promise.reject('Invalid/Empty_Number');
		/* Song Length */
		if (index > queue.songs.length) Promise.reject('TooHigh');
		if (index < 1) Promise.reject('TooLow');
		/* Index */
		if (!queue.songs[index]) Promise.reject('Unknown Song');
		/* Song */
		let song = queue.songs[index];
		if (!song) Promise.reject('NoSongIndex');
		queue.songs = queue.songs.filter(song => song !== queue.songs[index]);
		/* Resolve */
		return queue;
	}
}