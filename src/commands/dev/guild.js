import Command from '../../classes/Command.js'

export default class LeaveGuild extends Command {
	constructor(client) {
		super(client, {
			name: 'guild',
			aliases: ['lg'],
			description: 'Display some info about a guild, or do something to them.',
			usage: '<<Guild>.id> <leave | info | ping>',
			cooldown: 0
		}, {
			category: 'Developer'
		});
	}

	async execute({ Bot, msg, args }) {
		/* Args */
		const [id, action] = args;
		if (!id) {
			try {
				return msg.channel.send(super.createEmbed({
					title: 'Missing Args',
					color: 'RED',
					text: 'You need a guild ID.'
				}));
			} catch(error) {
				super.log('leaveguild@msg', error);
			}
		}

		/* Fetch */
		let guild = Bot.guilds.cache.get(id);
		if (!guild) {
			try {
				return msg.channel.send(super.createEmbed({
					title: 'Invalid Guild',
					color: 'RED',
					text: 'You need a valid guild bro.'
				}))
			} catch(error) {
				super.log('guild@msg', error);
			}
		}

		/* Actions */
		/* Leave */
		if (action === 'leave') {
			try {
				let ms = Date.now();
				guild = await guild.leave();
				ms = Date.now() - ms;
				try {
					await msg.channel.send(super.createEmbed({
						title: 'Guild Left',
						color: 'GREEN',
						text: `Successfully left **${guild.name}** in \`${ms}ms\``
					}));
				} catch(error) {
					super.log('guild@msg', error);
				}
			} catch(error) {
				super.log('guild', error);
			}
		}
		/* Ping */
		else if (action === 'ping') {
			try {
				let shard = guild.shard;
				await msg.channel.send(super.createEmbed({
					title: guild.name,
					color: 'YELLOW',
					fields: {
						'Shard ID': { content: shard.id },
						'Latency': { content: `\`${shard.ping}ms\`` }
					}
				}));
			} catch(error) {
				super.log('ping@msg', error);
			}
		}
		/* Info */
		else if (action === 'info') {

		}

	}
}