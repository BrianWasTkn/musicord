const { Command } = require('discord-akairo')

module.exports = class MusicQueue extends Command {
	constructor() {
		super('queue', {
			aliases: ['queue', 'q'],
			channel: 'guild',
			category: 'Music',
			typing: true,
			cooldown: 3000
		});
	}

	async exec(message, args) {
		const { channel, guild } = message;
		const { player } = this.client;

		const queue = await player.getQueue(message);
		const songs = queue.songs.map((song, index) => 
			`**${index === 0 ? ':musical_note:' : `${index + 1}.`} ${song.name} - \`${song.formattedDuration}\`**`
		);

		await channel.send(this.client.util.embed({
			title: guild.name,
			color: 'ORANGE',
			thumbnail: { url: songs[0].thumbnail },
			fields: [
				{ name: 'Now Playing', value: songs[0] },
				{ name: 'In Queue', value: songs[1] ? songs.slice(1).join('\n') : 'Nothing more in queue.' }
			] 
		}));
	}
}