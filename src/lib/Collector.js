import { MessageCollector } from 'discord.js'

export class Collector {
	constructor(client) {
		this.client = client;
	}

	awaitMessage(channel, userID, timeout) {
		const filter = m => m.author.id === userID;
		const collector = new MessageCollector(channel, filter, {
			max: 1
		});

		collector.on('end', collected => {
			const message = collected.first();
			if (!msg.content) return false;
			return message;
		})
	}
}