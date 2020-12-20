const { Listener } = require('discord-akairo');

module.exports = class ActivityListener extends Listener {
	constructor() {
		super('activityChanger', {
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