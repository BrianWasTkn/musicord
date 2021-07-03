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

	async exec(ctx: Context, entry: CurrencyEntry) {
		
	}
}