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

		let queue = await player.getQueue(message);
		queue = queue.songs.map((song, index) => {
			const { name, formattedDuration } = song;
			return `**${index === 0 ? ':musical_note:' : `${index + 1}.`} ${name} - \`${formattedDuration}\`**`
		}).slice(0, 10);

		await channel.send(this.client.util.embed({
			title: guild.name,
			color: 'ORANGE',
			description: song[0],
			fields: [
				{ name: 'Now Playing', value: queue[0] },
				{ name: 'In Queue', value: queue.slice(1).join('\n') }
			] 
		}));
	}
}