import distube from 'distube'

export default class Player extends distube {
	constructor(client, options) {
		super(client, options);
	}

	nowPlaying(message) {
		return new Promise(async(resolve, reject) => {
			const queue = this.guildQueues.get(message.guild.id);
			if (!queue) reject('Not Playing');
			resolve(queue.songs[0])
		})
	}

	mapQueue(message) {
		const queue = super.getQueue(message);
		if (!queue) return new Error('NotPlaying');
		const mapped = queue.songs.map((song, index) => `**#${index + 1}:** [__${song.name}__](${song.url}) - \`${song.formattedDuration}\``);
		return mapped;
	}

	remove(message, index) {
		return new Promise((resolve, reject) => {
			let queue = super.getQueue(message);
			if (!queue) reject('NoQueue');
			if (isNaN(index) || !index) reject('InvalidNumber');
			else if (index > queue.songs.length) reject('TooHigh');
			else if (index < 1) reject('TooLow');
			let song = queue.songs[index];
			if (!song) reject('NoSongIndex');
			queue = queue.songs.filter(s => s !== song);
			resolve(queue);
		})
	}
}