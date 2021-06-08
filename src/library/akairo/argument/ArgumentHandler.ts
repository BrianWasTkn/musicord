import { LavaClient, AbstractHandler, AbstractHandlerOptions } from 'lava/index';
import { Argument } from '.';
import { Message } from 'discord.js';

export class ArgumentHandler extends AbstractHandler<Argument> {
	/**
	 * Construct an argument handler.
	 */
	public constructor(client: LavaClient, options: AbstractHandlerOptions) {
		super(client, options);
	}

	/**
	 * Add command arguments.
	 */
	addTypes() {
		for (const arg of this.modules.values()) {
			this.client.handlers.command.resolver.addType(arg.id, arg.exec.bind(arg) as (m: Message, a: string) => any);
		}

		return this.client.handlers.command.resolver.types;
	}
}