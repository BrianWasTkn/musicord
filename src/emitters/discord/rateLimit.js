import Listener from '../../classes/Listener.js'

export default class RateLimit extends Listener {
	constructor(client) {
		super(client);
		/* Handle */
		const { Constants: Events } = require('discord.js');
		client.on(Events.RATE_LIMIT, this.handle);
	}

	async handle(rateLimit) {
		/** Log */
		try {
			this.log('Discord RateLimit warning', rateLimit);
		} catch(error) {
			super.log('RateLimit@log');
		}
	}
}