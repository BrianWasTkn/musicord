import Command from '../../classes/Command.js'

export default class Avatar extends Command {
	constructor(client) {
		super(client, {
			name: 'avatar',
			aliases: ['profile'],
			description: 'View yours or someone else\'s user avatar.',
			usage: '[<GuildMember>]',
			cooldown: 3000
		}, {
			category: 'Utility'
		});
	}

	formatLinks(user) {
		/* Vars */
		const formats = ['png', 'jpg', 'webp'], ret = [];
		/* Format */
		formats.forEach(f => {
			ret.push(`[${f}](${user.avatarURL({ format: f })})`)
		});
		/* Return */
		return ret.join(' | ');
	}

	async execute({ Bot, msg }) {
		try {
			const user = msg.mentions.users.first() || msg.member;
			await msg.channel.send(super.createEmbed({
				title: 'Avatar',
				color: 'BLUE',
				text: `Links\n[ ${this.formatLinks(user)} ]`,
				icon: user.avatarURL(),
				footer: {
					text: `Thanks for using ${Bot.user.username}!`,
					icon: Bot.user.avatarURL()
				}
			}));
		} catch(error) {
			super.log('avatar@msg', error);
		}
	}
}