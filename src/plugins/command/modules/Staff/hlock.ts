import { SubCommand, Context } from 'lava/index';

export default class extends SubCommand {
	constructor() {
		super('hlock', {
			aliases: ['hlock', 'hl'],
			clientPermissions: ['MANAGE_CHANNELS'],
			description: 'Lock the heist channel.',
			parent: 'staff',
			usage: '{command} [timeout=0]',
			args: [
				{
					id: 'tout',
					type: 'number',
					default: 0
				}
			]
		});
	}

	async exec(ctx: Context, { tout }: { tout: number }) {
		return await ctx.channel.send(`Locking in: ${tout} seconds`);
	}
}