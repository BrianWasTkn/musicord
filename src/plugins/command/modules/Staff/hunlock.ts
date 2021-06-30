import { SubCommand, Context } from 'lava/index';

export default class extends SubCommand {
	constructor() {
		super('hunlock', {
			aliases: ['hunlock', 'hul'],
			clientPermissions: ['MANAGE_CHANNELS'],
			description: 'Lock the heist channel.',
			parent: 'staff',
			staffOnly: true,
			usage: '{command} [timeout=60]',
			args: [
				{
					id: 'tout',
					type: 'number',
					default: 1000 * 60
				}
			]
		});
	}

	async exec(ctx: Context, { tout }: { tout: number }) {
		return await ctx.channel.send(`Unlocking in: ${tout} seconds`);
	}
}