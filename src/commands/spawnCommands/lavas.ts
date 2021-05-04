import { Context, MemberPlus } from 'lib/extensions';
import { MessageOptions } from 'discord.js';
import { Command } from 'lib/objects';
import { Lava } from 'lib/Lava';

export default class Spawn extends Command {
	constructor() {
		super('lavas', {
			name: 'Spawner Unpaids',
			aliases: ['lavas', 'unpaids', 'lvs'],
			channel: 'guild',
			description: "Display yours or someone else's unpaid lava coins.",
			category: 'Spawn',
			args: [
				{
					id: 'member',
					type: 'member',
					default: (message: Context) => message.member,
				},
			],
		});
	}

	async exec(ctx: Context<{ member: MemberPlus }>): Promise<MessageOptions> {
		const { fetch } = this.client.db.spawns;
		const { user } = ctx.args.member;
		const data = await fetch(user.id);

		return {
			replyTo: ctx.id, embed: {
				description: `**Total Events:** ${data.eventsJoined.toLocaleString()}\n**Unpaids:** ${data.unpaid.toLocaleString()}`,
				footer: { text: `Payments may take long.`, icon_url: ctx.author.avatarURL({ dynamic: true }) },
				title: `${user.username}'s unpaids`, color: 'RANDOM',
			}
		};
	}
}
