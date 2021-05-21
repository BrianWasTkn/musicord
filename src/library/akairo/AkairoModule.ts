/**
 * Base class for all custom modules.
 * @author BrianWasTaken
*/

import { AkairoHandler, AkairoModuleOptions, AkairoModule, AkairoClient, CommandDescription, Category } from 'discord-akairo';
import { AbstractHandler, LavaClient } from '.';
import { Collection } from 'discord.js';

export interface AbstractModuleOptions extends AkairoModuleOptions {
	name?: string;
}

export class AbstractModule extends AkairoModule {
	// Core Properties
	public readonly handler: AkairoHandler | AbstractHandler<this>;
	public category: Category<string, this>;
	public client: LavaClient;

	// Extra Options
	public name: string;
	public constructor(id: string, options: AbstractModuleOptions) {
		super(id, options);
		this.name = options.name;
	}

	public reload!: () => this;
	public remove!: () => this;
}