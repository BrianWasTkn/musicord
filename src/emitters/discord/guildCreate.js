import Listener from '../../classes/Listener'

export default class GuildCreate extends Listener {
	constructor(client) {
		super(client);
		/* Handle */
		client.on('guildCreate', async guild => await this.handle({
			Bot: client, guild
		}));
	}

	async handle({ Bot, guild }) {
		/* Find first channel */
		const channel = guild.channels.cache.first();
		/* Then send embed */
		await channel.send({
			title: Bot.user.username,
			color: 'BLUE',
			title: Bot.constants.intro(Bot),
			fields: {
				'Support': {
					content: `Click [this link](${Bot.config.support.guild.invite('Introduction')}) for support server.`,
					inline: true
				},
				'Commands': {
					content: `[${Bot.commands.size} total](${Bot.package.repo}/docs/README.md) commands`,
					inline: true
				},
				'Premium Keys': {
					content: 'Coming Soon:tm:',
					inline: true
				}
			},
			footer: {
				text: `Thanks for inviting ${Bot.user.username}!`,
				icon: Bot.user.avatarURL()
			}
		}).catch(error => super.log('GuildCreate@msg', error));
	}
}