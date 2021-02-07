import { Message } from 'discord.js'
import { Listener, Command } from 'discord-akairo'

export default class CommandListener extends Listener {
	public client: Akairo.Client;
	public constructor() {
		super('missingPermissions', {
			emitter: 'commandHandler',
			event: 'missingPermissions'
		});
	}

	public async exec(
		_: Message,
		command: Command,
		type: 'client' | 'user',
		missing: any
	): Promise<Message> {
		const embed = this.client.util.embed({
			title: 'Well rip, no perms',
			color: 'RED',
			description: [
				`${type === 'client' ? 'I' : 'You'} don\'t have enough permissions to run the \`${command.id}\` command.`,
				`Ensure ${type === 'client' ? 'I' : 'you'} have the following permissions:`
			].join('\n'),
			fields: [{
				name: `Missing Permissions • ${missing.length}`,
				value: `\`${missing.join('`, `')}\``
			}],
			footer: {
				text: this.client.user.username,
				iconURL: this.client.user.avatarURL()
			}
		});

		return _.channel.send({ embed });
	}
}
