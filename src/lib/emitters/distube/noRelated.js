import Listener from '../../structures/Listener'

export default class NoRelated extends Listener {
	constructor(client) {
		super(client);
		/* Emit */
		client.distube.on('noRelated', async message => await this.run({
			Bot: message.client,
			msg: message
		}));
	}

	async run({ Bot, msg }) {
		try {
			/* Message */
			await msg.channel.send(super.createEmbed({
				title: 'Nothing Found',
				color: 'RED',
				text: 'No song(s) were found during autoplay.'
			}));
		} catch(error) {
			super.log('NoRelated@sendMessage', error);
		}
	}
}