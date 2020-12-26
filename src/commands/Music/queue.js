const { Command } = require('discord-akairo')

module.exports = class Music extends Command {
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
		const { channel, guild } = message,
			{ player } = this.client;

		const queue = await player.getQueue(message),
			songs = queue.songs.map((song, index) => 
			`**${index === 0 ? ':musical_note:' : `${index + 1}.`}** ${song.name} - \`${song.formattedDuration}\``
		);

		try {
			await channel.send(this.client.util.embed({
				title: guild.name,
				color: 'ORANGE',
				thumbnail: { url: queue.songs[0].thumbnail },
				fields: [
					{ name: '**__Now Playing__**', value: queue.songs[0].thumbnail },
					{ name: '**__In Queue__**', value: songs[1] ? songs.slice(1).join('\n') : 'Nothing more in queue.' }
				] 
			}))
		} catch(error) {
			this.client.util.log(this.constructor.name, 'error', 'queue', error.stack);
		}
	}
}