import distube from 'distube'

export default class Player extends distube {
	constructor(client, options) {
		super(client, options);
	}

	nowPlaying(message) {
		return new Promise(async(resolve, reject) => {
			const queue = this.guildQueues.get(message.guild.id);
			if (!queue) {
				reject('Not Playing')
			}
			resolve(queue.songs[0])
		})
	}
}