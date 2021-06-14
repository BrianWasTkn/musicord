import { GambleCommand } from '../..';
import { Context } from 'lava/index';

export default class extends GambleCommand {
	constructor() {
		super('slots', {
			aliases: ['slotmachine', 'slots'],
			description: 'Spin the slot machine to have a chance to win a jackpot!',
			name: 'Slots',
		});
	}

	async exec(ctx: Context, args: { amount: string | number }) {

	}
}