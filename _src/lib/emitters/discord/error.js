import Listener from '../../structures/Listener'

export default class Error extends Listener {
	constructor(client) {
		super(client);
		/* Handle */
		const { Constants: Events } = require('discord.js');
		client.on(Events.ERROR, this.handle);
	}

	async handle(error) {
		/** Log */
		try {
			super.log('Discord Error', error);
		} catch(error) {
			super.log('Error@log', error);
		}
	}
}