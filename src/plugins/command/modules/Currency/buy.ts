import { Command, Context, Item, ItemMessages, Currency, CurrencyEntry } from 'lava/index';

interface BuyArgs { 
	amount: number;
	item: Item;
};

export default class extends Command {
	constructor() {
		super('buy', {
			aliases: ['buy', 'purchase'],
			category: 'Currency',
			clientPermissions: ['EMBED_LINKS'],
			description: 'Buy something from the shop!',
			name: 'Buy',
			args: [
				{
					id: 'item',
					type: 'item',
					default: null,
				},
				{
					id: 'amount',
					type: 'number',
					default: 1
				}
			]
		});
	}

	check(entry: CurrencyEntry, args: BuyArgs) {
		const { amount, item } = args;
		if (!item) {
			return ItemMessages.NEED_TO_BUY;
		}

		const inv = entry.items.get(item.id);
		const cost = this.getCost(item, inv.level);
		const pocket = entry.props.pocket;

		if (!item.buyable) {
			return ItemMessages.NOT_BUYABLE;
		}
		if (inv.owned >= Currency.MAX_INVENTORY) {
			return ItemMessages.INVENTORY_IS_FULL;
		}
		if (amount > Currency.MAX_INVENTORY) {
			return ItemMessages.AMOUNT_CAP;
		}
		if (amount < 1) {
			return ItemMessages.AMOUNT_BELOW_ONE;
		}
		if (amount > 1 && pocket < cost * amount) {
			return ItemMessages.NOT_BUYABLE_BULK;
		}
		if (pocket < cost * amount) {
			return ItemMessages.BROKE_TO_BUY;
		}
	}

	async exec(ctx: Context, args: BuyArgs) {
		const entry = await ctx.currency.fetch(ctx.author.id);
		const check = this.check(entry, args);
		if (check) return ctx.reply(check);

		const { amount, item } = args;
		const { price } = await args.item
			.buy(entry, amount);

		return ctx.reply({ embed: {
			author: {
				name: 'Successful Purchase',
				iconURL: ctx.author.avatarURL({
					dynamic: true
				})
			},
			color: 'GREEN',
			description: ItemMessages.BUY_MSG(item, price, amount),
			footer: {
				text: 'Thanks for your purchase!'
			}
		}});
	}
}