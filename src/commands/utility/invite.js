import Command from '../../classes/Command.js'

export default class Invite extends Command {
	constructor(client) {
		super(client, {
			name: 'invite',
			aliases: ['addbot'],
			description: 'Generates an invite link of this bot for your server.',
			usage: '[<Guild>.id]',
			cooldown: 3000
		}, {
			category: 'Utility'
		});
	}

	async execute({ Bot, msg, args }) {
		try {
			const invite = await Bot.generateInvite({
				guild: args[0] || null,
				permissions: [
					'SEND_MESSAGES', 'READ_MESSAGES', 
					'READ_MESSAGE_HISTORY', 'EMBED_LINKS',
					'CONNECT', 'SPEAK', 'MOVE_MEMBERS'
				]
			});
			try {
				await msg.channel.send(super.createEmbed({
					title: 'AddMe in your server',
					color: 'GREEN',
					text: `Click this [link]${invite} to add me in your server.`
				}));
			} catch(error) {
				super.log('invite@msg', error);
			}
		} catch(error) {
			super.log('invite@generate', error);
		}
	}
}