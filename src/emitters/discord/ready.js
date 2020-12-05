import Listener from '../../classes/Listener.js'

export default class Ready extends Listener {
	constructor(client) {
		super(client);
		/* Handle */
		const { Constants: Events } = require('discord.js');
		client.on(Events.CLIENT_READY, this.handle);
	}

	async handle() {
		/** Log */
		try {
			this.log(
				'main', 
				`${this.client.user.username} is now ready to play some beats!`
			);
		} catch(error) {
			super.log('Ready@log_ready_msg');
		}
	}
}