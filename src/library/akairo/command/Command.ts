/**
 * Command v2
 * @author BrianWasTaken
*/

import { Command as OldCommand, CommandOptions, CommandDescription, Category } from 'discord-akairo';
import { Collection, Message, MessageOptions } from 'discord.js';
import { AbstractModule, LavaClient } from 'lava/akairo';
import { CommandHandler } from '.';
import { Context } from 'lava/discord';

export declare interface Command extends OldCommand {
	/**
	 * The category this command belongs to.
	 */
	category: Category<string, this>;
	/**
	 * The handler who owns this command.
	 */
	handler: CommandHandler;
	/**
	 * The client instance.
	 */
	client: LavaClient;
	/**
	 * The description of this command.
	 */
	description: CommandDescription;
}

export class Command extends OldCommand implements AbstractModule {
	/**
	 * The name of this command.
	 */
	public name: string;

	/**
	 * Construct a command.
	 */
	public constructor(id: string, options: CommandOptions) {
		super(id, options);
		/** @type {string} */
		this.name = options.name ?? id.charAt(0).toUpperCase() + id.slice(1).toLowerCase();
		if (Boolean(process.env.DEV_MODE)) {
			/** @type {boolean} */
			this.ownerOnly = true;
		}
	}

	/**
	 * Method to run this command.
	 */
	public exec(context: Context, args?: any): PromiseUnion<MessageOptions> {
		return super.exec(context, args);
	}
}