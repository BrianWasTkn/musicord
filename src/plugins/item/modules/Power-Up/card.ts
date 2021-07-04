import { Context, CurrencyEntry } from 'lava/index';
import { PowerUpItem } from '../..';

export default class Tool extends PowerUpItem {
	constructor() {
		super('card', {
			assets: {
				name: 'Porsche\'s Card',
				emoji: ':credit_card:',
				price: 15000,
				intro: 'Do you need coin space?',
				info: 'Gives you 1000-5000 coins of expanded storage!'
			},
			config: {
				push: true
			},
			upgrades: [
				{
					price: 18000,
					info: 'Give yourself up to 7K bank storage!',
				},
				{
					price: 21000,
					info: 'Expand up to 10K bank storage!'
				},
				{
					price: 30000,
					info: 'Expand up to 20K bank storage NICE!'
				}
			]
		});
	}

	get thresholds() {
		return [5e3, 7e3, 10e3, 20e3];
	}

	async use(ctx: Context, entry: CurrencyEntry) {
		const { randomNumber, isInteger } = ctx.client.util;
		const { owned, level } = entry.items.get(this.id);

		await ctx.reply(`You have **${owned.toLocaleString()} cards** to swipe right now, how many of it do you wanna swipe?`);
		const choice = await ctx.awaitMessage(ctx.author.id, 15000);
		if (!choice) {
			return ctx.reply(`You need to reply and not waste my time okay?`);
		}
		if (!isInteger(choice.content) || Number(choice.content) > owned) {
			return ctx.reply(`It needs to be a real number and no more than what you own alright?`);
		}

		const gained = Array(Number(choice.content)).fill(null).map(() => randomNumber(1000, this.thresholds[level])).reduce((p, c) => p + c, 0);
		const space = await entry.expandVault(gained).save().then(e => e.props.space);
		return ctx.channel.send(`**You swiped __${
			Number(choice.content).toLocaleString()
		}__ cards into your bank.**\nThis brings you to **${
			space.toLocaleString()
		}** of total bank capacity, with **${
			gained.toLocaleString()
		} (${
			Math.round(gained / Number(choice.content)).toLocaleString()
		} average)** being increased.`);
	}
}