import Listener from '../../classes/Listener.js'

export default class Warn extends Listener {
	constructor(client) {
		super(client);
		/* Handle */
		const { Constants: Events } = require('discord.js');
		client.on(Events.WARN, this.handle);
	}

	async handle(info) {
		/** Log */
		try {
			this.log('Discord Warning', info);
		} catch(error) {
			super.log('Warn@log');
		}
	}
}