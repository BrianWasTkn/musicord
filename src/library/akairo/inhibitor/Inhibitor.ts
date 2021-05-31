/**
 * Inhibitor v2
 * @author BrianWasTaken
*/

import { Inhibitor as OldInhibitor, InhibitorOptions, Category } from 'discord-akairo';
import { AbstractModule, LavaClient, Command } from '..';
import { Collection, MessageOptions } from 'discord.js';
import { InhibitorHandler } from '.';
import { Context } from '../..';

export declare interface Inhibitor extends OldInhibitor {
	/**
	 * The category this inhibitor belongs to.
	 */
	category: Category<string, this>;
	/**
	 * The handler who owns this inhibitor.
	 */
	handler: InhibitorHandler;
	/**
	 * The client instance.
	 */
	client: LavaClient;
}

export class Inhibitor extends OldInhibitor implements AbstractModule {
	public name: string;
	public constructor(id: string, options: InhibitorOptions) {
		super(id, options);
		this.name = options.name;
	}

	public exec(context: Context, command?: Command): PromiseUnion<boolean>;
	public exec(context: Context, command?: Command): PromiseUnion<boolean> {
		return super.exec(context, command);
	}
}