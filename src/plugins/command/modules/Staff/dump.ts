import { SubCommand, Context } from 'lava/index';
import { Role } from 'discord.js';

export default class extends SubCommand {
	constructor() {
		super('dump', {
			aliases: ['dump'],
			description: 'View the list of people who has a specific role.',
			parent: 'staff',
			usage: '{command} <role_name>',
			args: [
				{
					id: 'role',
					type: 'role',
				}
			]
		});
	}

	exec(ctx: Context, { role }: { role: Role }) {
		if (!role || role.members.size < 1) {
			return ctx.reply('No members to dump.');
		}

		const idiots = role.members.map(member => `${member.user.tag} (${member.user.id})`);
		return ctx.channel.send(idiots.join('\n'));
	}
}