import Listener from '../../classes/Listener.js'

export default class Finish extends Listener {
	constructor(client) {
		super(client);
		/* Emit */
		client.distube.on('finish', async message => await this.run({
			Bot: message.client,
			msg: message
		}));
	}

	async run({ Bot, msg }) {
		try {
			/* Message */
			await msg.channel.send(super.createEmbed({
				title: 'Queue Cleared',
				color: 'RED',
				text: 'The player in this guild has finished playing all the tracks that were queued.'
			}));
		} catch(error) {
			super.log('Finish@sendMessage', error);
		}
	}
}