import Listener from '../../classes/Listener.js'

export default class Error extends Listener {
	constructor(client) {
		super(client);
		/* Emit */
		client.distube.on('error', async (message, err) => await this.run({
			Bot: message.client,
			msg: message, error: err
		}));
	}

	async run({ Bot, msg, error }) {
		try {
			/* Creat an invite in Memers Crib */
			const invite = Bot.guilds.cache
			.find(g => g.name.toLowerCase().includes('crib'))
			.channels.first()
			.createInvite({ 
				maxUses: 1, 
				reason: `${msg.author.tag} ran into error while using ${Bot.user.username}.` 
			});

			/* Message */
			await msg.channel.send(super.createEmbed({
				title: 'Player Error',
				color: 'RED',
				text: `\`\`\`js\n${error}\n\`\`\``,
				fields: {
					'Support Server': {
						content: `[Click/Tap this](${invite}) to join`
					}
				}
			}));
		} catch(error) {
			super.log('Error@sendMessage', error);
		}
	}
}