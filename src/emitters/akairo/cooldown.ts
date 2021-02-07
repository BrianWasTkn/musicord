import { Message } from 'discord.js'
import { Listener, Command } from 'discord-akairo'

export default class CommandListener extends Listener {
	public client: Akairo.Client;
	public constructor() {
		super('cooldown', {
			emitter: 'commandHandler',
			event: 'cooldown'
		});
	}

	public async exec(
		_: Message,
		command: Command,
		remaining: number
	): Promise<Message> {
		const embed = this.client.util.embed({
			title: 'Oh shit, on cooldown',
			color: 'RED',
			description: [
				`You're currently on cooldown for the \`${command.id}\` command.`,
				`Please wait **${(remaining / 1000).toFixed(2)}** seconds and try again.`
			].join('\n'),
			footer: {
				text: this.client.user.username,
				iconURL: this.client.user.avatarURL()
			}
		});

		return _.channel.send({ embed });
	}
}
