import Command from '../../classes/Command'

export default class MemerLock extends Command {
	constructor(client) {
		super(client, {
			name: 'memerlock',
			aliases: ['memelock', 'danklock', 'dl'],
			description: 'Locks all dank memer channels in this server.',
			usage: 'command',
			cooldown: 0
		}, {
			category: 'Crib',
			user_permissions: ['MANAGE_CHANNELS'],
			client_permissions: ['EMBED_LINKS', 'MANAGE_CHANNELS'],
			music_checks: [],
			args_required: false,
			exclusive: ['691416705917779999']
		});
	}

	async execute({ Bot, msg, args }) {
		/* Fetch Guild */
		const guild = Bot.config.memer_lock(Bot).guild;
		/* Fetch Channel Category*/
		const category = guild.channels.cache
		.filter(c => c.type === 'category')
		.find(c => c.name.toLowerCase().includes('dank'));
		const channels = category.children;
		/* Promises */
		let promises = [];
		let locked = [];
		let failed = [];
		for (const channel of channels) {
			promises.push(
				channel.updateOverwrite(guild.id, {
					SEND_MESSAGES: false
				}, `MemerLock v1 by ${msg.author.tag} (${msg.author.id})`)
				.then(c => locked.push(c))
				.catch(() => failed.push(channel))
			);
		}

		/* Lock */
		await Promise.all(promises);
		/* Cases */
		if (locked.length === channels.size) {
			return msg.channel.send(super.createEmbed({
				title: 'Channels Locked',
				color: 'GREEN',
				text: `Successfully locked **${locked.length} (all)** channels.`,
				fields: {
					'Channels': { content: locked.map(c => c.mention).join(', ') }
				}
			}));
		} else if ((failed.length >= 1) && (locked.length > failed.length)) {
			return msg.channel.send(super.createEmbed({
				title: 'Channels Locked',
				color: 'ORANGE',
				text: `Successfully locked **${locked.length}/${channels.size} (most)** channels.`,
				fields: {
					'Successful': { content: locked.map(c => c.mention).join(', ') },
					'Failed': { content: failed.map(c => c.mention).join(', ') }
				}
			}));
		} else if ((failed.length >= 1) && (locked.length < failed.length)) {
			return msg.channel.send(super.createEmbed({
				title: 'Channels Locked',
				color: 'ORANGE',
				text: `Successfully locked **${locked.length}/${channels.size} (some)** channels.`,
				fields: {
					'Successful': { content: locked.map(c => c.mention).join(', ') },
					'Failed': { content: failed.map(c => c.mention).join(', ') }
				}
			}));
		} else if (failed.length === channels.size) {
			return msg.channel.send(super.createEmbed({
				title: 'Cannot Lock',
				color: 'RED',
				text: 'No channels were locked at all. Check my permissions on those channels and try again.'
			}));
		}
	}
}