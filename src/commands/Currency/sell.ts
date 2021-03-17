import { Message, MessageOptions } from 'discord.js';
import { Command } from '@lib/handlers/command';
import { Embed } from '@lib/utility/embed';
import { Item } from '@lib/handlers/item';

export default class Currency extends Command {
	constructor() {
		super('sell', {
			aliases: ['sell'],
			channel: 'guild',
			description: 'Sell something to the shop.',
			category: 'Currency',
			cooldown: 1000,
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

	async exec(
		msg: Message,
		args: {
			amount: number;
			item: Item;
		}
	): Promise<string | MessageOptions> {
		const { amount = 1, item } = args;
		const { item: Items } = this.client.handlers;
		const { maxInventory } = this.client.config.currency;
		const { updateItems } = this.client.db.currency;
		const data = await updateItems(msg.author.id);
		let inv = data.items.find((i) => i.id === item.id);

		if (!item)
			return 'You need something to sell';
		else if (amount < 1)
			return 'Imagine selling none.';
		else if (!item.sellable)
			return "You can't sell this item rip";

		const {
			sold,
			amount: amt,
			data: dat,
			item: i
		} = await Items.sell(amount, msg.author.id, item.id);

		const embed = new Embed()
			.setDescription(
				`Succesfully sold **${amt.toLocaleString()} ${i.name}**${amt > 1 ? 's' : ''
				} and got \`${sold.toLocaleString()}\`.`
			)
			.setAuthor('Item Sold', msg.author.avatarURL({ dynamic: true }))
			.setColor('GREEN');

		return { embed };
	}
}
