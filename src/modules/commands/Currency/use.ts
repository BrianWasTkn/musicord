import { Context, ContextDatabase } from 'lib/extensions';
import { MessageOptions } from 'discord.js';
import { Command, Item } from 'lib/objects';

export default class Currency extends Command {
	constructor() {
		super('use', {
			name: 'Use',
			aliases: ['use', 'consume'],
			channel: 'guild',
			description: 'Use an item you own.',
			category: 'Currency',
			cooldown: 3e3,
			args: [
				{
					id: 'item',
					type: 'shopItem',
				},
				{
					id: 'times',
					type: 'number',
					default: 1
				}
			],
		});
	}

	async exec(ctx: Context<{ item: Item, times: number }>, userEntry: ContextDatabase): Promise<MessageOptions> {
		const { parseTime } = ctx.client.util, { item, times } = ctx.args;
		const { data } = userEntry;
		if (!item) {
			return { reply: { messageReference: ctx.id, failIfNotExists: false }, content: "This item doesn't exist :skull:" };
		}

		const inv = item.findInv(data.items, item);
		function check(inv: Currency.InventorySlot) {
			let state = false;
			switch (true) {
				case !inv || inv.amount < 1:
					return { state, m: `${item.emoji} You don't own this item!` };
				case inv.expire > Date.now():
					return {
						state,
						m: `**${item.emoji} This item is active right now!**\nWait **${parseTime(
							(inv.expire - Date.now()) / 1e3, true
						)}** and use it again.`,
					};
				case !item.usable:
					return { state, m: "You can't use this item :thinking:" };
				default:
					return { state: true, m: null };
			}
		}

		if (!check(inv).state) {
			return { reply: { messageReference: ctx.id, failIfNotExists: false }, content: check(inv).m };
		}

		await userEntry.addCd().updateItems().save();
		return (await item.use(ctx, times)) as MessageOptions;
	}
}
