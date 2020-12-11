import { Command } from './Command'

export class EcoCMD extends Command {
	constructor(fn, help, name) {
		super(fn, help, name);
	}

	async execute({ ctx, msg, args, isPremiumUser }) {
		const { guild, channel, member } = msg;

		const fn = await this.run({ ctx, msg, args });
	}
}