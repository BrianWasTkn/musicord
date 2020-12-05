import Command from '../../classes/Command.js'

export default class Ping extends Command {
	constructor(client) {
		super(client, {
			name: 'ping',
			aliases: ['pong', 'latency'],
			description: 'View my latency for this guild.',
			usage: 'command',
			cooldown: 3000
		}, {
			category: 'Utility'
		});
	}

	keyMirror(status) {
		const { Status } = require('discord.js').Util;
		const newObj = Object.create(null);
		for (const [prop, val] of Object.entries(Status)) {
			newObj[val] = prop;
		}
		return newObj[status];
	}

	async execute({ Bot, msg }) {
		try {
			const shard = msg.guild.shard;
			await msg.channel.send(super.createEmbed({
				title: msg.guild.name,
				color: 'YELLOW',
				fields: {
					'Status': { content: this.keyMirror(shard.status), inline: true },
					'Shard ID':{content: shard.id,	inline: true },
					'Latency':{ content: `\`${shard.ping}ms\``,		inline: true }
				},
				footer: {
					text: `Thanks for using ${Bot.user.username}!`,
					icon: Bot.user.avatarURL()
				}
			}));
		} catch(error) {
			super.log('ping@msg', error);
		}
	}
}