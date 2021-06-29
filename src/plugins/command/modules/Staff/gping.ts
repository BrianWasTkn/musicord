import { SubCommand, Context } from 'lava/index';

export default class extends SubCommand {
	constructor() {
		super('gping', {
			aliases: ['gping', 'gp'],
			clientPermissions: ['MENTION_EVERYONE'],
			description: 'Ping the Giveaway Ping role.',
			name: 'Giveaway Ping',
			parent: 'staff',
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
		return await ctx.channel.send({ content: role.toString(), embed: {
			footer: {
				text: ctx.author.username,
				iconURL: ctx.author.avatarURL({ dynamic: true })
			},
			description: msg,
			color: 'GOLD',
			title: ':tada: Giveaway Time :tada:'
		}});
	}
}