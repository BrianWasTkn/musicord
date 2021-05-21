import { LotteryHandler, Listener } from 'lib/objects';
import { TextChannel } from 'discord.js';

export default class LottoListener extends Listener<LotteryHandler> {
	constructor() {
		super('lottoPatch', {
			emitter: 'lottery',
			event: 'patch',
			name: 'Lottery Patch'
		});
	}

	async exec(handler: LotteryHandler): Promise<void> {
		const guild = await this.client.guilds.fetch(handler.guild, true, true);
		const chan = (await this.client.channels.fetch(
			handler.channel
		)) as TextChannel;
		const req = await guild.roles.fetch(handler.requirement);

		const msgs = [
			`Host Guild: ${guild.name}`,
			`Channel: ${chan.name}`,
			`Role: ${req.name}`,
		];

		for (const msg of msgs) {
			this.client.util.console.log('Lottery', msg);
		}
	}
}
