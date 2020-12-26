const { Command } = require('discord-akairo')

module.exports = class Util extends Command {
	constructor() {
		super('help', {
			aliases: ['help', 'commands'],
			channel: 'guild',
			category: 'Utility',
			typing: true,
			cooldown: 3000,
			args: [
				{ id: 'query', type: 'command' }
			]
		});
	}

	async exec(message, args) {
		const { channel } = message;
		if (args.query) {
			const { query } = args;
			return channel.send({ embed: {
				title: `${query.aliases[0]} info`,
				color: 'ORANGE',
				fields: [
					{ name: 'Category', 
						value: query.categoryID },
					{ name: 'Cooldown', 
						value: `${(query.cooldown || query.defaultCooldown) / 1000}s` },
					{ name: 'RateLimit', 
						value: `\`${command.rateLimit}\` uses per cooldown` }
				],
				footer: {
					text: this.client.user.username,
					iconURL: this.client.user.avatarURL()
				}
			}});
		} else {
			return channel.send(`No command found for \`${args.query}\``);
		}
	}
}
