import Listener from '../../structures/Listener'

export default class Warn extends Listener {
	constructor(client) {
		super(client);
		/* Handle */
		const { Constants: Events } = require('discord.js');
		client.on(Events.WARN, this.handle.bind(client));
	}

	async handle(info) {
		/** Log */
		try {
			this.utils.log(
				'Listener',
				'main',
				`[WARN => ${info}]`
			);
		} catch(error) {
			super.log('Warn@log', error);
		}
	}
}