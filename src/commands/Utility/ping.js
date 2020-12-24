const { Command } = require('discord-akairo')

module.exports = class UtilityCommand extends Command {
	constructor() {
		super('ping', {
			aliases: ['ping', 'latency'],
			category: 'Utility',
			typing: true,
			cooldown: 5000,
			rateLimit: 2
		});
	}

	async exec(message) {
		const { guild, channel } = message;
		await channel.send({ embed: {
			title: guild.name,
			color: 'ORANGE',
			description: [
				`**Shard ID:** ${guild.shard.id}`,
				`**Latency:** \`${guild.shard.ping}ms\``,
				`**Websocket:** \`${this.client.ws.ping}ms\``
			].join('\n'),
			footer: { 
				text: this.client.user.username, 
				iconURL: this.client.user.avatarURL()
			}
		}});
	}
}
