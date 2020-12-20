const { Listener } = require('discord-akairo');

module.exports = class DiscordReady extends Listener {
	constructor() {
		super('activity', {
			emitter: 'client',
			event: 'ready',
			type: 'on'
		});
	}

	async exec() {
		this.client.util.log(
			this.constructor.name, 'main',
			`${this.client.user.tag} is now logged in to Discord.`
		);
		
		await this.client.channels.cache
		.get('789692296094285825')
		.send({ embed: {
			title: 'Ready',
			color: 'ORANGE',
			description: `${this.client.user.username} logged in.`,
			image: { url: this.client.user.avatarURL() },
			footer: {
				text: this.client.user.username,
				iconURL: this.client.user.avatarURL()
			}
		}});

	}
}