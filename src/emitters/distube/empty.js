import Listener from '../../classes/Listener.js'

export default class Empty extends Listener {
	constructor(client) {
		super(client);
		/* Emit */
		client.distube.on('empty', async message => await this.run({
			Bot: message.client,
			msg: message
		}));
	}

	async run({ Bot, msg }) {
		try {
			/* Message */
			await msg.channel.send(super.createEmbed({
				title: 'Channel Empty',
				color: 'ORANGE',
				text: `I left **${Bot.distube.getQueue(msg).connection.channel.name}** after 60 seconds of inactivity.`
			}));
		} catch(error) {
			super.log('Finish@sendMessage', error);
		}
	}
}