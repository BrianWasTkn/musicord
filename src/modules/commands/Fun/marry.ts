import { Context, ContextDatabase, MemberPlus } from 'lib/extensions';
import { MessageOptions } from 'discord.js';
import { Command } from 'lib/objects';

export default class Fun extends Command {
	constructor() {
		super('marry', {
			name: 'Marry',
			aliases: ['marry'],
			channel: 'guild',
			description: 'Marry someone!',
			category: 'Fun',
			args: [
				{
					id: 'someone',
					type: 'member',
				},
			],
		});
	}

	async exec(ctx: Context<{ someone: MemberPlus }>): Promise<MessageOptions> {
		const Ring = ctx.client.handlers.item.modules.get('donut');
		const meEntry = await ctx.db.fetch(), me = meEntry.data;
		const { someone } = ctx.args;
		await meEntry.save(true);

		if (!someone) {
			if (!me.marriage.id) {
				return {
					replyTo: ctx.id,
					content: "You're not married to anyone right now.",
				};
			}

			const some1 = await ctx.client.users.fetch(me.marriage.id, true, true);
			const since = new Date(me.marriage.since);

			return {
				embed: {
					author: {
						name: `${ctx.author.username}'s marriage`,
						icon_url: ctx.author.avatarURL({ dynamic: true }),
					},
					color: 'PINK',
					description: `**Married to:** ${some1.toString()}\n**Since:** ${since.toDateString()}\n**Ring:** ${Ring.emoji
						} ${Ring.name}`,
					thumbnail: {
						url: some1.avatarURL({ dynamic: true }),
					},
				},
			};
		}

		const someoneEntry = await (new ContextDatabase(ctx)).fetch(someone.user.id);
		const s = (await ctx.db.fetch(someone.user.id, false)).data;
		const inv = Ring.findInv(me.items);
		const inv2 = Ring.findInv(s.items);

		if (inv.amount < 1 || inv2.amount < 1) {
			return {
				replyTo: ctx.id,
				content: `Both of you must have at least **1 ${Ring.emoji} ${Ring.name}** in your inventories!`,
			};
		}
		if (s.marriage.id) {
			const marriedTo = (await ctx.guild.members.fetch({
				user: me.marriage.id, force: true, cache: true,
			})) as MemberPlus;

			return {
				replyTo: ctx.id,
				content: `Sad to say but they're already married to **${marriedTo.user.tag}** bro :(`,
			};
		}
		if (someone.user.bot) {
			return { replyTo: ctx.id, content: 'Imagine marrying bots' };
		}
		if (ctx.author.id === someone.user.id) {
			return {
				replyTo: ctx.id,
				content: "Lol imagine marrying yourself, couldn't be me honestly.",
			};
		}

		await ctx.send({ content: `${someone.toString()} do you accept this marriage? Type \`(y / n)\` in 30 seconds.`} );
		const ido = (await ctx.awaitMessage(someone.user.id, 3e4)).first();
		if (!ido || !['y'].includes(ido.content.toLowerCase().slice(0, 1))) {
			return { content: 'I guess not then.' };
		}

		await someoneEntry.marry(ctx.author.id).removeInv(Ring.id).save();
		await meEntry.marry(someone.user.id).removeInv(Ring.id).save();
		// meEntry.updateQuest({ cmd: this, count: 1 }); 
		return {
			replyTo: ctx.id, content:
				`You're now married to ${someone.user.toString()} GGs! Type \`lava ${this.aliases[0]
				}\` to see your marriage profile!`,
		};
	}
}
