import { Listener, CommandHandler, Command } from 'lib/objects';
import { MessageEmbed } from 'discord.js';
import { Context } from 'lib/extensions';

export default class CommandListener extends Listener<CommandHandler<Command>> {
	constructor() {
		super('missingPermissions', {
			emitter: 'command',
			event: 'missingPermissions',
			name: 'Missing Permissions',
		});
	}

	async exec(ctx: Context, command: Command, type: string, missing: any) {
		type = type === 'client' ? 'I' : 'You';
		const d: string[] = [];
		d.push(
			`${type} don\'t have enough permissions to run the \`${command.id}\` command.`
		);
		d.push(`Ensure ${type} have the following permissions:`);

		const embed = new MessageEmbed()
			.setDescription(d.join('\n'))
			.setColor('RED')
			.addField(
				`Missing Permissions • ${missing.length}`,
				`\`${missing.join('`, `')}\``
			)
			.setFooter(this.client.user.username, this.client.user.avatarURL())
			.setTitle('Well rip, no perms.');

		return ctx.send({ embed });
	}
}
