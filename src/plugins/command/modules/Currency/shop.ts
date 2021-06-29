import { Command, Context, ItemSale, Item, Inventory } from 'lava/index';
import { Argument } from 'discord-akairo';

export default class extends Command {
	constructor() {
		super('shop', {
			aliases: ['shop', 'store'],
			category: 'Currency',
			clientPermissions: ['EMBED_LINKS'],
			description: 'Check the shop items!',
			name: 'Shop',
			args: [
				{
					id: 'query',
					default: 1,
					type: Argument.union('number', 'item')
				}
			]
		});
	}

	getIcon(item: Item, inv: Inventory) {
		return item.upgrades[inv.level].premium ? ':key:' : ':coin:';
	}

	displayItem(item: Item, invs: CollectionPlus<Inventory>, saleNav = false) {
		const { shortInfo, longInfo, emoji } = item;
		const { discount, item: saleItem } = item.handler.sale;
		const { name, price, icon } = item.getUpgrade(invs.get(item.id));
		const saleInv = invs.get(saleItem.id);

		if (saleNav) {
			const off = `[${price.toLocaleString()}](https://google.com) ( [***${discount}% OFF!***](https://discord.gg/memer) )`;
			return `**${emoji} ${name}** — ${this.getIcon(saleItem, saleInv)} ${off}\n${longInfo}`;
		}

		return `**${emoji} ${name}** — ${icon} [${price.toLocaleString()}](https://google.com)\n${shortInfo}`;
	}

	async exec(ctx: Context, args: { query: number | Item }) {
		const { paginateArray, parseTime } = ctx.client.util;
		const { item: handler } = ctx.client.handlers;
		const entry = await ctx.currency.fetch(ctx.author.id);
		const items = [...handler.modules.values()];

		if (typeof args.query === 'number') {
			const shop = paginateArray(items.sort((a, b) => b.price - a.price).filter(i => i.shop).map(i => this.displayItem(i, entry.items)));
			const left = parseTime((handler.sale.nextSale - Date.now()) / 1000);
			if (args.query > shop.length) {
				return ctx.reply(`Page \`${args.query}\` doesn't exist.`);
			}

			return ctx.channel.send({ embed: {
				title: 'Lava Shop', color: 'ORANGE', footer: {
					text: `Lava Shop — Page ${args.query} of ${shop.length}`
				}, fields: [
					{
						name: `**__LIGHTNING SALE__** (resets in ${left})`,
						value: this.displayItem(handler.sale.item, entry.items, true)
					},
					{
						name: 'Shop Items',
						value: shop[args.query - 1].join('\n\n')
					}
				]
			}});
		}

		const { query } = args;
		const { sale } = handler;

		if (!query) {
			return ctx.reply('That item doesn\'t exist tho');
		}

		const thisLevel = entry.items.get(query.id);
		const icon = this.getIcon(query, thisLevel);
		const { owned, level } = thisLevel;
		const { emoji, name } = query.upgrades[level];
		const { cost, sell } = query.getSale(thisLevel);

		return ctx.channel.send({ embed: {
			title: `${emoji} ${name} - Level ${level === query.upgrades.length ? `${level} (Max)` : level} ${owned > 0 ? `- ${owned.toLocaleString()} owned` : ''}`,
			color: 'RANDOM', description: [
				`${query.longInfo}\n`, 
				[
					`**BUY** — ${query.buyable ? `${icon} ${cost.toLocaleString()}` : '**Not Buyable**'}`,
					`**SELL** — ${query.sellable ? `${icon} ${sell.toLocaleString()}` : '**Not Sellable**'}`
				].join('\n')
			].join('\n')
		}})
	}
}