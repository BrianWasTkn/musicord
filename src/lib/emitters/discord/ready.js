import Listener from '../../structures/Listener'

export default class Ready extends Listener {
	constructor(client) {
		super(client);
		/* Handle */
		const { Constants: Events } = require('discord.js');
		client.on(Events.CLIENT_READY, this.handle.bind(client));
	}

	async handle() {
		try {
			this.utils.log(
				'Listener',
				'main',
				`[READY => ${this.user.username} is now ready to play some beats!]`
			);
		} catch(error) {
			super.log('Ready@log_ready_msg', error);
		}
	}
}