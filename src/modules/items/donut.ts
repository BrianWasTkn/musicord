import { Context } from 'lib/extensions';
import { MessageOptions } from 'discord.js';
import { Item } from 'lib/objects';

export default class Collectible extends Item {
	constructor() {
		super('donut', {
			category: 'Collectible',
			sellable: false,
			buyable: true,
			usable: true,
			emoji: ':doughnut:',
			name: 'Donut Ring',
			cost: 5000000,
			tier: 3,
			info: {
				short: 'They say this item is the key for a great relationship.',
				long: "Either eat it (doesn't deduct) or use it to marry someone!",
			},
		});
	}

	use(ctx: Context): MessageOptions {
		return { replyTo: ctx.id, content: `${this.emoji} You ate sum yummy donuts! Nom Omm Onm` };
	}
}
