import Command from '../classes/Command.js'

export default class Leave extends Command {
	constructor(client) {
		super(client, {
			name: 'leave',
			aliases: ['unbound'],
			description: 'Musicord leaves your voice channel.',
			usage: '[timeout]',
			cooldown: 5000
		}, {
			category: 'Music',
			checks: []
		});
	}

	async execute({ Bot, msg }) {
		try {
			/** Voice Channel of <GuildMember> */
			const { channel } = msg.member.voice;
			/** Voice Connection of <Client> */
			const connection = Bot.voice.connections.get(msg.guild.id);
			/** Checks if <GuildMember>.voice.connection === <Client>.voice.connection */
			if (connection && connection.channel.id === channel.id) {
				/** Leave */
				const voice = await channel.leave();
				/** Return Message */
				return msg.channel.send(super.createEmbed({
					title: 'Channel Left',
					color: 'GREEN',
					text: `Successfully left voice channel **${voice.channel.name}**.`
				}));
			} else {
				/** Stay and Return Message */
				return msg.channel.send(super.createEmbed({
					title: 'Channel Difference',
					color: 'RED',
					text: 'You\'re in a different voice channel than me.'
				}));
			}
		} catch(error) {
			super.log('leave', error);
		}
	}
}