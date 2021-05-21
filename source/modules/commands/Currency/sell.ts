import { ITEM_MESSAGES as MESSAGES } from 'lib/utility/constants';
import { Context, ContextDatabase } from 'lib/extensions';
import { MessageOptions } from 'discord.js';
import { Command, Item } from 'lib/objects';

export default class Currency extends Command {
	constructor() {
		super('sell', {
			name: 'Sell',
			aliases: ['sell'],
			channel: 'guild',
			description: 'Sell something to the shop.',
			category: 'Currency',
			cooldown: 500,
			args: [
				{
					id: 'item',
					type: 'shopItem',
				},
				{
					id: 'amount',
					type: 'number',
					default: 1,
				},
			],
		});
	}

	public async exec(
		ctx: Context<{ amount: number; item: Item }>,
		userEntry: ContextDatabase
	): Promise<MessageOptions> {
		const { amount = 1, item } = ctx.args;
		const { item: Items } = this.client.handlers;
		const data = userEntry.data;

		function check() {
			if (!item) return MESSAGES.NEED_TO_SELL;
			let inv = data.items.find((i) => i.id === item.id);
			if (amount < 1) return MESSAGES.SELLING_NONE;
			if (!item.sellable) return MESSAGES.NOT_SELLABLE;
			if (amount > inv.amount) return MESSAGES.CANT_FOOL_ME;
		}

		if (check()) return { content: check(), reply: { messageReference: ctx.id, failIfNotExists: false }, };
		const { discount, id } = Items.sale;
		const dPrice = Math.round(item.cost - item.cost * (Items.sale.discount / 1e2));
		const sold = item.premium ? amount * (item.cost / 4) : item.id === id
			? amount * (dPrice / 4) : amount * (item.cost / 4);

		await (item.premium 
			? userEntry.addPremiumKeys(Math.round(sold))
			: userEntry.addPocket(Math.round(sold))
		)
		.removeInv(item.id, Math.round(amount))
		.updateQuest({ cmd: this, count: amount, item })
		.save();

		return {
			reply: { messageReference: ctx.id, failIfNotExists: false }, embed: {
				author: { name: `Item "${item.name}" sold`, iconURL: ctx.author.avatarURL({ dynamic: true }) },
				footer: { text: 'Thanks for stopping by!', iconURL: ctx.client.user.avatarURL() },
				color: 'GREEN', description: MESSAGES.SELL_MSG(item.premium)
					.replace(/{got}/gi, Math.round(sold).toLocaleString())
					.replace(/{amount}/gi, Math.trunc(amount).toLocaleString())
					.replace(/{emoji}/gi, item.emoji)
					.replace(/{item}/gi, item.name),
			}
		};
	}
}
