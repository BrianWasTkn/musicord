import { MessageOptions, Role } from 'discord.js';
import { Context } from 'lib/extensions';
import { Command } from 'lib/objects';
import bot from 'src/../package.json';

export default class Util extends Command {
	constructor() {
		super('rcr', {
			name: 'Role Color Change',
			aliases: ['rcr'],
			channel: 'guild',
			description: 'Change the role color randomly.',
			userPermissions: ['MANAGE_ROLES'],
			category: 'Utility',
			args: [{
				id: 'role',
				type: 'role',
				default: (m: Context) => m.guild.roles.cache.get('716344676634066964')
			}]
		});
	}

	async exec(ctx: Context<{ role: Role }>): Promise<MessageOptions> {
		const { randomNumber } = ctx.client.util;
		const { role } = ctx.args;

		let chars = 'abcdef123456';
		let color = '';
		for (let i = 6; i > 0; i--) {
			color += chars[randomNumber(0, chars.length)];
		}

		const nice = await role.edit({ color });
		return { embed: { color, description: `Changed the color of **${nice.name}** to **#${color}**` } };
	};
}
