import Command from '../classes/Command.js'

export default class Join extends Command {
	constructor(client) {
		super(client, {
			name: 'join',
			aliases: ['bound'],
			description: 'Joins your current voice channel.',
			usage: 'command',
			cooldown: 5000
		}, {
			category: 'Music',
			checks: []
		});
	}

	async execute({ msg }) {

		/** Voice Channel */
		const channel = msg.member.voice.channel;

		/** Joinable */
		if (!channel.joinable) {
			try {
				return msg.channel.send(super.createEmbed({
					title: 'Missing Permissions',
					color: 'RED',
					text: 'Make sure I have permissions to `CONNECT` in your voice channel.'
				}));
			} catch(error) {
				super.log('join@msg', error);
			}
		}

		/** Full */
		if (channel.full) {
			try {
				return msg.channel.send(super.createEmbed({
					title: 'Channel Full',
					color: 'RED',
					text: 'Your voice channel is already full so I\'m unable to join.'
				}));
			} catch(error) {
				super.log('join@msg', error);
			}
		}

		/** Do the thing */
		try {
			/* Leave */
			const voice = await channel.join();
			try {
				/* Message */
				await msg.channel.send(super.createEmbed({
					title: 'Channel Joined',
					color: 'RED',
					text: `Successfully join **${voice.channel.name}**.`
				}));
			} catch(error) {
				super.log('join@msg', error);
			}
		} catch(error) {
			super.log('join', error);
		}
	}
}