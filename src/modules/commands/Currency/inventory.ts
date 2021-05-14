import { Context, ContextDatabase, MemberPlus, UserPlus } from 'lib/extensions';
import { MessageOptions, Message } from 'discord.js';
import { Command } from 'lib/objects';

export default class Currency extends Command {
	constructor() {
		super('inventory', {
			name: 'Inventory',
			aliases: ['inv', 'items'],
			channel: 'guild',
			description: 'Check your inventory.',
			category: 'Currency',
			cooldown: 1e3,
			args: [
				{
					id: 'member',
					default: 1,
					type: ((msg: Context, phrase: string) => {
						if (!phrase) return 1; // inventory page
						const { resolver } = this.handler;
						return (
							resolver.type('number')(msg, phrase) ||
							resolver.type('memberMention')(msg, phrase)
						);
					}) as (m: Message, a: string) => any,
				},
				{
					id: 'page',
					type: 'number',
					default: 1,
				},
			],
		});
	}

	async exec(
		ctx: Context<{
			member: number | MemberPlus;
			page: number;
		}>,
		userEntry: ContextDatabase
	): Promise<MessageOptions> {
		const { util, handlers } = ctx.client;
		const { member, page } = ctx.args;
		const { item: Items } = handlers;
		const isNum = typeof member === 'number';

		let inv: string[] | string[][] | Currency.InventorySlot[];
		let total: number = 0;
		let data: CurrencyProfile;
		let memb: MemberPlus;
		let pg: number;

		memb = (isNum ? ctx.member : member) as MemberPlus;
		pg = (isNum ? member : page) as number;
		const isContext = memb.user.id === ctx.author.id;
		const entry = isContext ? userEntry : await ctx.db.fetch(memb.user.id);
		data = entry.data;
		inv = data.items.filter((i) => i.amount >= 1);
		total = inv.reduce((e, a) => a.amount + e, 0);
		if (inv.length < 1) {
			return { replyTo: ctx.id, content: `${memb.user.id === ctx.author.id ? 'you' : 'they'} don't have items in ${memb.user.id === ctx.author.id ? 'your' : 'their'} inventory!` };
		}

		inv = util.paginateArray(
			Array.from(Items.modules.values())
				.map((mod) => mod.id)
				.sort() // alphabetical order of IDs
				.map((mod) => {
					const it = Items.modules.get(mod);
					return it.findInv(data.items);
				})
				.filter((i) => i.amount >= 1)
				.map((inv) => {
					const it = Items.modules.get(inv.id);
					const iv = it.findInv(data.items);
					return `**${it.emoji} ${it.name
						}** — ${iv.amount.toLocaleString()}\n*ID* \`${it.id}\` — ${it.category.id
						}`;
				}),
			5
		);

		if (pg > inv.length) {
			return { replyTo: ctx.id, content: `Page \`${pg}\` doesn't exist.` };
		}

		return {
			embed: {
				color: 'BLURPLE',
				author: {
					name: `${memb.user.username}'s inventory`,
					iconURL: memb.user.avatarURL({ dynamic: true }),
				},
				fields: [
					{
						name: `Owned Items — ${total.toLocaleString()} total`,
						value: inv[pg - 1].join('\n\n'),
					},
				],
				footer: {
					text: `Owned Items — Page ${pg} of ${inv.length}`,
				},
			},
		};
	}
}
