import { MessageOptions } from 'discord.js';
import { Context } from 'lib/extensions';
import { Item } from 'lib/objects';

export default class Collectible extends Item {
	constructor() {
		super('trophy', {
			category: 'Flex',
			sellable: false,
			buyable: true,
			usable: true,
			emoji: '🏆',
			name: 'Lava Trophy',
			cost: 500000000,
			tier: 2,
			checks: ['activeState'],
			info: {
				short: 'A very powerful item to flex against normies.',
				long:
					'Grants you 100% multiplier if you own one and another trophy to flex against normies!',
			},
		});
	}

	async use(ctx: Context): Promise<MessageOptions> {
		const { randomNumber } = this.client.util;
		const tr = this.findInv(ctx.db.data.items, this);
		const odds = randomNumber(1, 100);

		if (odds >= 3) {
			const nice = randomNumber(1, 100);
			const won = randomNumber(1, 10000);
			await ctx.db.addInv(this.id, nice).addPocket(won).updateItems().save();
			return {
				replyTo: ctx.id, embed: {
					description: `You got **${nice} ${this.emoji} ${this.name}** and **${won.toLocaleString()}** coins!`,
					color: 'GREEN',
				}
			};
		}

		const hahayes = randomNumber(tr.amount / 2, tr.amount);
		await ctx.db.removeInv(this.id, hahayes).updateItems().save();

		return {
			replyTo: ctx.id, embed: {
				description: `You broke **${hahayes} ${this.emoji} ${this.name}** :skull:`,
				color: 'RED',
			}
		};
	}
}
