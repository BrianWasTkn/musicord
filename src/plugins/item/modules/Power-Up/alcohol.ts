import { Context, CurrencyEntry, ItemEffects } from 'lava/index';
import { PowerUpItem } from '../..';

export default class PowerUp extends PowerUpItem {
	constructor() {
		super('alcohol', {
			assets: {
				name: 'Alcohol',
				emoji: ':beer:',
				price: 20000,
				intro: 'Toxic luck?',
				info: 'Grant yourself either a bad, good or great amount of luck in gamble and robbing!',
			},
			config: {
				duration: 1000 * 60 * 60 * 12,
				push: true
			},
			upgrades: [
				{ price: 40000, duration: 1000 * 60 * 60 * 16 },
				{ price: 80000, duration: 1000 * 60 * 60 * 24 },
				{ price: 120000, duration: 1000 * 60 * 60 * 36 },
			]
		});
	}

	effect(effects: ItemEffects, entry: CurrencyEntry) {
		return effects.rob(entry.props.items.get(this.id).multiplier); // multi for luck between 0 and 100
	}

	async use(ctx: Context, entry: CurrencyEntry) {
		const { parseTime, randomNumber } = ctx.client.util;
		const duration = this.getDuration(entry);
		const expire = Date.now() + duration;
		const won = randomNumber(100, 1000);

		await entry.addPocket(won).activateItem(this.id, expire).save();
		return ctx.reply({ embed: {
			description: `Your ${this.id} will begone in ${parseTime(duration / 1000)}`,
			color: 'FUCHSIA', author: { name: `You activated your ${this.name}!` },
			footer: { text: `Coin Bonus: +${won.toLocaleString()} coins` }
		}});
	}
}
