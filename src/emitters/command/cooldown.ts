import { Listener, Command, LavaClient } from 'discord-akairo'
import { Message } from 'discord.js'

export default class CommandHandler extends Listener {
	public client: LavaClient;
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
			color: 'INDIGO',
			description: [
				`You're currently on cooldown for the \`${command.id}\` command.`,
				`Please wait **${remaining.toFixed(2)}** seconds and try again.`
			].join('\n'),
			footer: {
				text: this.client.user.username,
				iconURL: this.client.user.avatarURL()
			}
		});

		return _.channel.send({ embed });
	}
}
