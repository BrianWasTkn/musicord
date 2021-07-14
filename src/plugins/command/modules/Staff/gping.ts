import { SubCommand, Context } from 'lava/index';

export default class extends SubCommand {
	constructor() {
		super('gping', {
			aliases: ['gping', 'gp'],
			clientPermissions: ['MENTION_EVERYONE'],
			description: 'Ping the Giveaway Ping role.',
			name: 'Giveaway Ping',
			parent: 'staff',
			staffOnly: true,
			usage: '{command} [msg]',
			args: [
				{
					id: 'msg',
					type: 'string',
					match: 'rest',
					default: 'Join the giveaway!'
				}
			]
		});
	}

	async exec(ctx: Context, { msg }: { msg: string }) {
		const role = ctx.guild.roles.cache.get('692519399567130645');

		await ctx.delete();
		await ctx.channel.send({ 
			content: [`:tada: ${role.toString()}`, msg].join('\n'), 
			allowedMentions: { roles: [role.id] },
		});

		return false;
	}
}