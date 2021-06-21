/**
 * Command v2
 * @author BrianWasTaken
*/

import { Collection, Message, MessageOptions, MessageEmbedOptions, MessageEmbed } from 'discord.js';
import { Command as OldCommand, CommandOptions, CommandDescription, Category } from 'discord-akairo';
import { AbstractModule, LavaClient } from 'lava/akairo';
import { CommandHandler, SubCommand } from '.';
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
	 * Wether to show this command in help command.
	 */
	public help: boolean;
	/**
	 * Wether this command is a subcommand or not.
	 */
	public type: 'subcommand' | 'command';
	/**
	 * Usage of this command.
	 */
	public usage: string;

	/**
	 * Construct a command.
	 */
	public constructor(id: string, options: CommandOptions) {
		super(id, options);
		/** @type {string} */
		this.name = options.name ?? id.charAt(0).toUpperCase() + id.slice(1).toLowerCase();
		/** @type {boolean} */
		this.help = options.help ?? true;
		/** @type {'subcommand'|'command'} */
		this.type = options.type ?? 'command';
		/** @type {string} */
		this.usage = (options.usage ?? '{command}').replace('{command}', this.aliases[0]);
		if (process.env.DEV_MODE === 'true') {
			/** @type {boolean} */
			this.ownerOnly = true;
		}
	}

	/**
	 * Method to run this command.
	 */
	public exec(context: Context, args?: any): PromiseUnion<any> {
		return super.exec(context, args);
	}

	/**
	 * The subcommands of this command.
	 */
	get subCommands(): SubCommand[] {
		const subs = this.handler.modules.filter(m => m.type === 'subcommand');
		return subs.size > 0 ? subs.array() as SubCommand[] : null;
	}
}