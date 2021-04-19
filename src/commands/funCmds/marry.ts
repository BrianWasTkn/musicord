import { MessageOptions } from 'discord.js';
import { Context } from '@lib/extensions/message';
import { UserPlus } from '@lib/extensions/user';
import { Command } from '@lib/handlers/command';

export default class Fun extends Command {
	constructor() {
		super('marry', {
			aliases: ['marry'],
			channel: 'guild',
			description: 'Marry someone!',
			category: 'Fun',
			args: [
				{
					id: 'someone',
					type: 'user',
					default: null
				}
			]
		})
	}

	async exec(ctx: Context<{ someone: UserPlus }>): Promise<MessageOptions> {
		const Ring = this.client.handlers.item.modules.get('donut');
		const { data: me } = await ctx.db.fetch();
		const { someone } = ctx.args;

		if (!someone) {
			if (!me.marriage.id) {
				return { replyTo: ctx.id, content: 'You\'re not married to anyone right now.' };
			}

			const some1 = await this.client.users.fetch(me.marriage.id, true, true);
			const since = new Date(me.marriage.since);

			return { embed: {
				author: {
					name: `${ctx.author.username}'s marriage`,
					icon_url: ctx.author.avatarURL({ dynamic: true })
				},
				color: 'PINK',
				description: `**Married to:** ${some1.toString()}\n**Since:** ${since.toDateString()}\n**Ring:** ${Ring.emoji} ${Ring.name}`,
				thumbnail: {
					url: some1.avatarURL({ dynamic: true })
				}
			}};
		}

		const s = await someone.fetchDB();
		const inv = me.items.find(i => i.id === Ring.id);
		const inv2 = s.items.find(i => i.id === Ring.id);

		if (inv.amount < 1 || inv2.amount < 1) {
			return { replyTo: ctx.id, content: `Both of you must have at least **1 ${Ring.emoji} ${Ring.name}** in your inventories!` };
		}
		if (s.marriage.id) {
			const marriedTo = (await this.client.users.fetch(s.marriage.id)) as UserPlus;
			return { replyTo: ctx.id, content: `Sad to say but they're already married to **${marriedTo.tag}** bro :(`};
		}
		if (someone.bot) {
			return { replyTo: ctx.id, content: 'Imagine marrying a bot' };
		}
		if (ctx.author.id === someone.id) {
			return { replyTo: ctx.id, content: 'Lol imagine marrying yourself, couldn\'t be me honestly.' };
		}

		await ctx.channel.send(`${someone.toString()} do you accept this marriage? Type \`y\` or \`n\` in 30 seconds.`);
		const ido = (await ctx.channel
			.awaitMessages(m => m.author.id === someone.id, {
				max: 1, time: 3e4
			})
		).first();

		if (!ido || !['yes', 'y'].includes(ido.content.toLowerCase())) {
			return { content: 'I guess not then.' };
		}

		inv.amount--;
		me.marriage.id = someone.id;
		me.marriage.since = Date.now();
		await me.save();

		inv2.amount--;
		s.marriage.id = ctx.author.id;
		s.marriage.since = Date.now();
		await s.save();

		return { replyTo: ctx.id, content: `You're now married to ${someone.toString()} GGs! Type \`lava ${this.aliases[0]}\` to see your marriage profile!` };
	}
}