import { CurrencyProfile } from '@lib/interface/mongo/currency'
import { Document } from 'mongoose'
import { Message } from 'discord.js'
import { Item } from '@lib/handlers/item'

export default class Collectible extends Item {
	constructor() {
		super('trophy', {
			category: 'Collectible',
			sellable: false,
			buyable: true,
			usable: true,
			emoji: '🏆',
			info: 'Grants you another trophy if you use it.',
			cost: 25000000,
		});
	}

	async use(msg: Message): Promise<Document & CurrencyProfile> {
		const data = await this.client.db.currency.fetch(msg.author.id);
		data.items.find(i => i.id === this.id).amount++;
		await data.save();
		return data;
	}
}