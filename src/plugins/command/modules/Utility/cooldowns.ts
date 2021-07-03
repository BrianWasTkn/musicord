import { Command, Context, GuildMemberPlus, Cooldown } from 'lava/index';
import { MessageOptions } from 'discord.js';

export default class extends Command {
	public constructor() {
		super('cooldowns', {
			aliases: ['cooldowns', 'cds'],
			clientPermissions: ['EMBED_LINKS'],
			name: 'Cooldowns',
			args: [
				{
					id: 'member',
					type: 'member',
					default: (c: Context) => c.member
				}
			]
		});
	}

	display(cooldown: Cooldown) {
		return `${cooldown.id}: ${this.calc((cooldown.expiresAt - Date.now()) / 1000).join(':')}`
	}

	calc(time: number) {
		const methods = [2592000, 86400, 3600, 60, 1];
		const ret = [Math.floor(time / methods[0])];

		for (let i = 0; i < methods.length - 1; i++) {
			const raw = (time % methods[i]) / methods[i + 1];
			const calced = Math.floor(raw);
			ret.push(Math.floor(raw));
		}

		return ret.map(r => r < 10 ? `0${r}` : `${r}`);
	}

	async exec(ctx: Context, { member }: { member: GuildMemberPlus }) {
		const entry = await ctx.lava.fetch(ctx.author.id);
		return ctx.channel.send({ embed: {
			author: { name: `${member.user.username}'s cooldowns` },
			color: 'ORANGE', description: entry.cooldowns
				.filter(cd => cd.isActive())
				.map(this.calc)
				.join('\n') ?? 'No active cooldowns.'
		}}).then(() => false);
	}
}