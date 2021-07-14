import { SubCommand, Context } from 'lava/index';

export default class extends SubCommand {
	constructor() {
		super('eping', {
			aliases: ['eping', 'ep'],
			clientPermissions: ['MENTION_EVERYONE'],
			description: 'Ping the Event Ping role.',
			name: 'Event Ping',
			parent: 'staff',
			staffOnly: true,
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
		const role = ctx.guild.roles.cache.get('704013651887128707');

		await ctx.delete();
		await ctx.channel.send({ 
			content: [`:tada: ${role.toString()}`, msg].join('\n'), 
			allowedMentions: { roles: [role.id] },
		});

		return false;
	}
}