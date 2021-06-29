import { Command, Context, GuildMemberPlus, Inventory } from 'lava/index';
import { Argument } from 'discord-akairo';

interface InventoryArgs {
	member: GuildMemberPlus | number;
	page: number;
}

export default class extends Command {
	constructor() {
		super('inventory', {
			aliases: ['inventory', 'items', 'inv'],
			clientPermissions: ['EMBED_LINKS'],
			description: 'View all items you own.',
			name: 'Inventory',
			args: [
				{
					id: 'member',
					default: 1,
					type: Argument.union('number', 'memberMention')
				},
				{
					id: 'page',
					type: 'number',
					default: 1
				}
			]
		});
	}

	resolveArgs(ctx: Context, args: InventoryArgs) {
		const isMemberNumber = typeof args.member === 'number';
		return <{ member: GuildMemberPlus, page: number }>{
			member: isMemberNumber ? ctx.member : (args.member ?? ctx.member),
			page: isMemberNumber ? args.member : (args.page ?? 1)
		}
	}

	async exec(ctx: Context, args: InventoryArgs) {
		const { member, page } = this.resolveArgs(ctx, args);
		const isContext = ctx.author.id === member.user.id;

		const entry = await ctx.currency.fetch(member.user.id);
		const inventory = ctx.client.util.paginateArray(this.mapItems(entry.items));

		if (inventory.length < 1) {
			return ctx.reply(`${isContext ? 'You' : 'They'} don't have any items on ${isContext ? 'your' : 'their'} inventory!`);
		}
		if (page > inventory.length) {
			return ctx.reply(`Page \`${page}\` doesn't exist.`);
		}

		return ctx.channel.send({
			embed: {
				color: 'BLURPLE',
				author: {
					name: `${ctx.author.username}'s inventory`,
					icon_url: member.user.avatarURL({ dynamic: true })
				},
				fields: [
					{
						name: 'Owned Items',
						value: inventory[page - 1].join('\n\n')
					}
				],
				footer: {
					text: `Owned Items — Page ${page} of ${inventory.length}`
				}
			}
		});
	}

	mapItems(items: CollectionPlus<Inventory>) {
		return [...items.values()]
			.filter(inv => inv.isOwned())
			.filter(inv => inv.module.inventory)
			.map(inv => ({
				mod: inv.module,
				owned: inv.owned,
				level: inv.level
			}))
			.map(({ mod, owned, level }) => {
				const { category, emoji, name, id, upgrades } = mod;
				const state = upgrades.length - 1 === level ? '`MAX LEVEL`' : `${upgrades.length - 1 - level} more`;
				return `**${emoji} ${name}** — ${owned.toLocaleString()}\n*ID* \`${id}\` — ${category.id}\n*LVL* \`${level}\` — ${state}`
			});
	}
}