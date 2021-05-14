import { Listener, CommandHandler, Command } from 'lib/objects';
import { MessageOptions } from 'discord.js';
import { Context } from 'lib/extensions';

export default class CommandListener extends Listener<CommandHandler<Command>> {
	constructor() {
		super('commandFinished', {
			emitter: 'command',
			event: 'commandFinished',
			name: 'Command Finished',
		});
	}

	async exec(
		ctx: Context,
		command: Command,
		args: any[],
		returned: MessageOptions | Promise<MessageOptions>
	) {
		return this.client.handlers.command.commandUtils.delete(ctx.id);
	}
}
