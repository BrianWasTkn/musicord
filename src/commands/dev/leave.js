import Command from '../classes/Command.js'

export default class Join extends Command {
	constructor(client) {
		super(client, {
			name: 'leaveguild',
			aliases: ['lg'],
			description: 'Forcively leave a discord guild.',
			usage: '<Guild>.id',
			cooldown: 0
		});

		/**
		 * Command Category 
		 * @type {String}
		 */
		this.category = 'Developer';
	}

	async execute({ Bot, msg, args }) {
		/* Args */
		const [id] = args;
		if (!id) {
			try {
				return msg.channel.send(super.createEmbed({
					title: 'Missing Args',
					color: 'RED',
					text: 'You need a guild ID for me to leave that guild.'
				}));
			} catch(error) {
				super.log('leaveguild@msg', error);
			}
		}

		/* Fetch */
		try {
			let guild = Bot.guilds.cache.get(id);
			guild = await guild.leave();
			try {
				await msg.channel.send(super.createEmbed({
					title: 'Guild Left',
					color: 'GREEN',
					text: `Successfully left **${guild.name}**.`,
					fields: {
						'Guild ID': { content: guild.id, inline: true },
						'Members': { content: guild.members.cache.size.toLocaleString(), inline: true },
						'Channels': { content: guild.channels.cache.size.toLocaleString(), inline: true }
					}
				}));
			} catch(error) {
				super.log('leaveguild@msg')
			}
		} catch(error) {
			super.log('leaveguild', error);
		}
	}
}