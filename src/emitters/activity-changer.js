const { Listener } = require('discord-akairo');

module.exports = class DiscordReady extends Listener {
	constructor() {
		super('activity', {
			emitter: 'client',
			event: 'ready',
			type: 'on'
		});
	}

	exec() {
		this.client.util.log(
			this.constructor.name, 'main',
			`${this.client.user.tag} is now logged in to Discord.`
		);
	}
}