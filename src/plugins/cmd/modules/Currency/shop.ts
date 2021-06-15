import { Command, Context, ItemSale, Item, Inventory } from 'lava/index';
import { Argument } from 'discord-akairo';

export default class extends Command {
	constructor() {
		super('shop', {
			aliases: ['shop', 'store'],
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
		return item.config.premium ? ':key:' : ':coin:';
	}

	calc(price: number, discount: number) {
		return price - (price * (discount / 100));
	}

	displayItem(item: Item, saleNav: boolean, inv: Inventory) {
		const { name, description, config, emoji } = item;
		const { discount, item: dItem } = item.handler.sale;

		const price = item.upgrades[inv.level].price;
		const cost = dItem.id === item.id ? this.calc(price, discount) : price;

		if (saleNav) {
			const off = `[${cost.toLocaleString()}](https://google.com) ( [***${discount}% OFF!***](https://discord.gg/memer) )`;
			return `**${emoji} ${name}** — ${this.getIcon(dItem)} ${off}\n${description.long}`;
		}

		return `**${emoji} ${name}** — ${this.getIcon(item)} [${cost.toLocaleString()}](https://google.com)\n${description.short}`;
	}

	getPrices(item: Item, sale: ItemSale, inv: Inventory) {
		const isSale = item.id === sale.item.id;
		return {
			sell: this.calc(item.sell(item.upgrades[inv.level].sell), isSale ? sale.discount : 0),
			buy: this.calc(item.upgrades[inv.level].price, isSale ? sale.discount : 0),
		}
	}

	async exec(ctx: Context, args: { query: number | Item }) {
		const { paginateArray, parseTime } = ctx.client.util;
		const { item: handler } = ctx.client.handlers;
		const entry = await ctx.currency.fetch(ctx.author.id);
		const items = [...handler.modules.values()];

		if (typeof args.query === 'number') {
			const shop = paginateArray(items.sort((a, b) => b.price - a.price).map((i => this.displayItem(i, false, entry.items.get(i.id)))));
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

		const inventoryItem = entry.items.get(query.id);
		const { owned, level } = inventoryItem;
		const { buy, sell } = this.getPrices(query, sale, inventoryItem);

		return ctx.channel.send({ embed: {
			title: `${query.emoji} ${query.name}${owned > 0 ? `(${owned.toLocaleString()} owned)` : ''}`,
			color: 'RANDOM', description: [
				`${query.description.long}\n`, 
				[
					`**BUY** — ${query.config.buyable ? `${this.getIcon(query)} ${buy.toLocaleString()}` : '**Not Buyable**'}`,
					`**SELL** — ${query.config.sellable ? `${this.getIcon(query)} ${sell.toLocaleString()}` : '**Not Sellable**'}`
				].join('\n')
			].join('\n')
		}})
	}
}