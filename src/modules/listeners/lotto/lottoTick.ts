import { LotteryHandler, Listener } from 'lib/objects';
import { TextChannel } from 'discord.js';

export default class LottoListener extends Listener<LotteryHandler> {
	constructor() {
		super('lottoTick', {
			emitter: 'lottery',
			event: 'tick',
			name: 'Lottery Tick'
		});
	}

	async exec(_: LotteryHandler, minLeft: string, remain: number) {
		return console.log({ minLeft, remain });
	}
}
