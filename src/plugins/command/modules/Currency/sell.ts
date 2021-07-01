import { Command, Context, Item, ItemMessages, Currency, CurrencyEntry } from 'lava/index';

interface SellArgs { 
	amount: number;
	item: Item;
};

export default class extends Command {
	constructor() {
		super('sell', {
			aliases: ['sell'],
			clientPermissions: ['EMBED_LINKS'],
			description: 'Sell something to the shop!',
			name: 'Sell',
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

	check(entry: CurrencyEntry, args: SellArgs) {
		const { amount, item } = args;

		const inv = entry.items.get(item.id);
		const { pocket } = entry.props;

		if (!item) {
			return ItemMessages.NEED_TO_SELL;
		}
		if (!item.sellable) {
			return ItemMessages.NOT_SELLABLE;
		}
		if (amount < 1) {
			return ItemMessages.SELLING_NONE;
		}
		if (amount > inv.owned) {
			return ItemMessages.CANT_FOOL_ME(inv.owned);
		}
	}

	async exec(ctx: Context, args: SellArgs) {
		const entry = await ctx.currency.fetch(ctx.author.id);
		const check = this.check(entry, args);
		if (check) return ctx.reply(check);

		const { amount, item } = args;
		const { price, sell } = await item.sell(entry, amount);

		return ctx.reply({ embed: {
			author: {
				name: 'Successfully Sold',
				iconURL: ctx.author.avatarURL({
					dynamic: true
				})
			},
			color: 'GREEN',
			description: ItemMessages.SELL_MSG(item, price * sell * amount, amount),
			footer: {
				text: 'Thanks for stopping by!'
			}
		}});
	}
}