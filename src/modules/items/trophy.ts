import { MessageOptions } from 'discord.js';
import { Context } from 'lib/extensions';
import { Item } from 'lib/objects';

export default class Collectible extends Item {
	constructor() {
		super('trophy', {
			category: 'Collectible',
			sellable: false,
			buyable: true,
			usable: true,
			emoji: '🏆',
			name: 'Trophy',
			cost: 30000000,
			tier: 2,
			checks: ['activeState'],
			info: {
				short: 'A very powerful item to flex against normies.',
				long:
					'Grants you 30% multiplier if you own one to flex against normies!',
			},
		});
	}

	use(ctx: Context): MessageOptions {
		const { randomNumber } = this.client.util;
		const trophy = this.findInv(ctx.db.data.items, this);

		return {
			replyTo: ctx.id,
			content: `**${this.emoji} What a flex!** Your trophy is shining on the VERY dark sky and the wolves are barking.${
				trophy.amount >= 2 ? `\n**AND THEY HAVE ${trophy.amount} OF THEM WHAT A BADASS!**` : ''
			}`
		};
	}
}
