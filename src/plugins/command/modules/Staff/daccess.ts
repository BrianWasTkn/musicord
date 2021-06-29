import { SubCommand, GuildMemberPlus, Context } from 'lava/index';

export default class extends SubCommand {
	constructor() {
		super('daccess', {
			aliases: ['daccess', 'da'],
			clientPermissions: ['MANAGE_ROLES'],
			description: 'Add or remove the donation queue role.',
			parent: 'staff',
			usage: '{command} [some1]',
			args: [
				{
					id: 'some1',
					type: 'member',
					default: (ctx: Context) => ctx.member
				}
			]
		});
	}

	async exec(ctx: Context, { some1 }: { some1: GuildMemberPlus }) {
		const role = ctx.guild.roles.cache.get('715507078860505091');
		if (some1.roles.cache.has(role.id)) {
			await some1.roles.remove(role.id);
			return ctx.reply(`Removed **${role.name}** from **${some1.user.tag}**.`);
		}

		await some1.roles.add(role.id);
		return ctx.reply(`Added **${role.name}** from **${some1.user.tag}**.`);
	}
}