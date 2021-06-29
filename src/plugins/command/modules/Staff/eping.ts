import { SubCommand, Context } from 'lava/index';

export default class extends SubCommand {
	constructor() {
		super('eping', {
			aliases: ['eping', 'ep'],
			clientPermissions: ['MENTION_EVERYONE'],
			description: 'Ping the Event Ping role.',
			parent: 'staff',
			usage: '{command} [msg]',
			args: [
				{
					id: 'msg',
					type: 'string',
					match: 'rest',
					default: 'Enjoy the event!'
				}
			]
		});
	}

	async exec(ctx: Context, { msg }: { msg: string }) {
		return await ctx.channel.send(`Your message: ${msg}`);
	}
}