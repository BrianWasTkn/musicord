/**
 * Command v2
 * @author BrianWasTaken
*/

import { Command as OldCommand, CommandOptions, CommandDescription, Category } from 'discord-akairo';
import { Collection, Message, MessageOptions } from 'discord.js';
import { AbstractModule, LavaClient } from '..';
import { CommandHandler } from '.';
import { Context } from '../..';

/**
 * Command
 * @extends {OldCommand}
 * @implements {AbstractModule}
*/
export class Command extends OldCommand implements AbstractModule {
	public description: CommandDescription;
	public category: Category<string, this>;
	public handler: CommandHandler;
	public client: LavaClient;
	public name: string;
	public constructor(id: string, options: CommandOptions) {
		super(id, options);
		this.name = options.name;
	}

	public exec(context: Context, args?: any): PromiseUnion<MessageOptions> {
		return super.exec(context, args);
	}
}