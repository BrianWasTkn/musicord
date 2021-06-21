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

	getIcon(item: Item) {
		return item.premium ? ':key:' : ':coin:';
	}

	calc(price: number, discount: number) {
		return price - (price * (discount / 100));
	}

	displayItem(item: Item, saleNav: boolean, inv: Inventory) {
		const { shortInfo, longInfo, emoji } = item;
		const { discount, item: dItem } = item.handler.sale;
		const name = item.upgrades[inv.level].name;

		const price = item.upgrades[inv.level].price;
		const cost = dItem.id === item.id ? this.calc(price, discount) : price;

		if (saleNav) {
			const off = `[${cost.toLocaleString()}](https://google.com) ( [***${discount}% OFF!***](https://discord.gg/memer) )`;
			return `**${emoji} ${name}** — ${this.getIcon(dItem)} ${off}\n${longInfo}`;
		}

		return `**${emoji} ${name}** — ${this.getIcon(item)} [${cost.toLocaleString()}](https://google.com)\n${shortInfo}`;
	}

	getPrices(item: Item, level: number) {
		const isSale = item.id === item.handler.sale.item.id;
		return {
			sell: this.calc(item.sell(item.upgrades[level].price), isSale ? item.handler.sale.discount : 0),
			buy: this.calc(item.upgrades[level].price, isSale ? item.handler.sale.discount : 0),
		}
	}

	async exec(ctx: Context, args: { query: number | Item }) {
		const { paginateArray, parseTime } = ctx.client.util;
		const { item: handler } = ctx.client.handlers;
		const entry = await ctx.currency.fetch(ctx.author.id);
		const items = [...handler.modules.values()];

		if (typeof args.query === 'number') {
			const shop = paginateArray(items.sort((a, b) => b.price - a.price).filter(i => i.shop).map(i => this.displayItem(i, false, entry.items.get(i.id))));
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
						value: this.displayItem(handler.sale.item, true, entry.items.get(handler.sale.item.id))
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

		const { owned, level } = entry.items.get(query.id);
		const { emoji, name } = query.upgrades[level];
		const { buy, sell } = this.getPrices(query, level);

		return ctx.channel.send({ embed: {
			title: `${emoji} ${name}${owned > 0 ? ` (${owned.toLocaleString()} owned)` : ''} — Level ${level === query.upgrades.length ? `${level} (Max)` : level}`,
			color: 'RANDOM', description: [
				`${query.longInfo}\n`, 
				[
					`**BUY** — ${query.buyable ? `${this.getIcon(query)} ${buy.toLocaleString()}` : '**Not Buyable**'}`,
					`**SELL** — ${query.sellable ? `${this.getIcon(query)} ${sell.toLocaleString()}` : '**Not Sellable**'}`
				].join('\n')
			].join('\n')
		}})
	}
}