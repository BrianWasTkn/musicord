import { Command } from './Command'

export class UtilCMD extends Command {
	constructor(fn, help, name) {
		super(fn, help, name);
	}

	async execute({ ctx, msg, args }) {
		const { guild, channel, member } = msg;

		const fn = await this.run({ ctx, msg, args });
	}
}