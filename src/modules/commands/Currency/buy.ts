import { ITEM_MESSAGES as MESSAGES } from 'lib/utility/constants';
import { Context, ContextDatabase } from 'lib/extensions';
import { MessageOptions } from 'discord.js';
import { Command, Item } from 'lib/objects';
import { Argument } from 'discord-akairo';
import config from 'config/index';

export default class Currency extends Command {
	constructor() {
		super('buy', {
			name: 'Buy',
			aliases: ['buy', 'purchase'],
			channel: 'guild',
			description: 'Buy something from the shop.',
			category: 'Currency',
			cooldown: 500,
			args: [
				{
					id: 'item',
					type: 'shopItem',
				},
				{
					id: 'amount',
					type: Argument.union('number', 'string'),
					default: 1,
				},
			],
		});
	}

	async exec(
		ctx: Context<{
			amount: string | number;
			item: Item;
		}>, userEntry: ContextDatabase
	): Promise<MessageOptions> {
		let { amount = 1, item } = ctx.args;
		const { maxInventory } = config.currency;
		const { item: Items } = ctx.client.handlers;
		const data = userEntry.data; // no destruct coz style owo

		if (amount.constructor === String) {
			const pocket = item.premium ? data.prem : data.pocket;
			switch((amount as string).toLowerCase()) {
				case 'all':
				case 'max':
					amount = Math.round(pocket / item.cost);
					break;
				case 'half':
					amount = Math.round((pocket / 2) / item.cost);
				default:
					amount = 1;
					break;
			}
		}

		function check() {
			if (!item) return MESSAGES.NEED_TO_BUY;
			let inv = data.items.find((i) => i.id === item.id);
			if (amount < 1) return MESSAGES.AMOUNT_BELOW_ONE;
			if (!item.buyable) return MESSAGES.NOT_BUYABLE;
			if (amount > maxInventory) return MESSAGES.AMOUNT_CAP;
			if (inv.amount >= maxInventory) return MESSAGES.INVENTORY_IS_FULL;
			if ((item.premium ? data.prem : data.pocket) < item.cost) return MESSAGES.BROKE_TO_BUY;
			if ((item.premium ? data.prem : data.pocket) < (amount as number) * item.cost) return MESSAGES.NOT_BUYABLE_BULK;
		}

		if (check()) return { content: check() };
		const { id, discount } = Items.sale;
		const dPrice = Math.round(item.cost - item.cost * (discount / 1e2));
		const paid = item.premium ? item.cost * (amount as number) : id === item.id
			? (amount as number) * dPrice : (amount as number) * item.cost;

		await (item.premium 
			? userEntry.removePremiumKeys(Math.round(paid))
			: userEntry.removePocket(Math.round(paid))
		)
		.updateQuest({ cmd: this, count: (amount as number), item })
		.addInv(item.id, Math.round(amount as number)).save(true);

		return {
			replyTo: ctx.id, embed: {
				author: { name: `Successful "${item.name}" purchase`, iconURL: ctx.author.avatarURL({ dynamic: true }) },
				footer: { text: 'Thank you for your purchase!', iconURL: ctx.client.user.avatarURL() }, color: 'GREEN',
				description: MESSAGES.BUY_MSG(item.premium)
					.replace(/{paid}/gi, Math.round(paid).toLocaleString())
					.replace(/{amount}/gi, Math.trunc((amount as number)).toLocaleString())
					.replace(/{emoji}/gi, item.emoji)
					.replace(/{item}/gi, item.name),
			}
		};
	}
}
