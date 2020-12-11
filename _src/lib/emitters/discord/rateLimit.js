import Listener from '../../structures/Listener'

export default class RateLimit extends Listener {
	constructor(client) {
		super(client);
		/* Handle */
		const { Constants: Events } = require('discord.js');
		client.on(Events.RATE_LIMIT, this.handle.bind(client));
	}

	async handle(rateLimit) {
		/** Log */
		try {
			this.utils.log(
				'Listener',
				'main',
				`[RATELIMIT => ${rateLimit}]`
			);
		} catch(error) {
			super.log('RateLimit@log', error);
		}
	}
}