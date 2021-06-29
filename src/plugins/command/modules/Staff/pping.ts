import { SubCommand, Context } from 'lava/index';

export default class extends SubCommand {
	constructor() {
		super('pping', {
			aliases: ['pping', 'pp'],
			clientPermissions: ['MENTION_EVERYONE'],
			description: 'Ping the Partnership Ping role.',
			parent: 'staff',
			usage: '{command} [msg]',
			args: [
				{
					id: 'msg',
					type: 'string',
					match: 'rest',
					default: 'Try this server!'
				}
			]
		});
	}

	async exec(ctx: Context, { msg }: { msg: string }) {
		return await ctx.channel.send(`Your message: ${msg}`);
	}
}