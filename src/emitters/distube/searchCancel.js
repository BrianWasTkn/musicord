import Listener from '../../classes/Listener.js'

export default class SearchCancel extends Listener {
	constructor(client) {
		super(client);
		/* Emit */
		client.distube.on('searchCancel', async message => await this.run({
			Bot: message.client,
			msg: message
		}));
	}

	async run({ Bot, msg }) {
		try {
			/* Message */
			await msg.channel.send(super.createEmbed({
				title: 'Search Cancelled',
				color: 'RED',
				text: 'Your search has been cancelled.',
				footer: {
					text: `Thanks for using ${Bot.user.username}!`,
					icon: Bot.user.avatarURL()
				}
			}));
		} catch(error) {
			super.log('SearchCancel@sendMessage', error);
		}
	}
}