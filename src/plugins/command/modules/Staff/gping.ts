import { SubCommand, Context } from 'lava/index';

export default class extends SubCommand {
	constructor() {
		super('gping', {
			aliases: ['gping', 'gp'],
			clientPermissions: ['MENTION_EVERYONE'],
			description: 'Ping the Giveaway Ping role.',
			parent: 'staff',
			usage: '{command} [msg]',
			args: [
				{
					id: 'msg',
					type: 'string',
					default: 'Join the giveaway!'
				}
			]
		});
	}

	async exec(ctx: Context, { msg }: { msg: string }) {
		return await ctx.channel.send(`Your message: ${msg}`);
	}
}