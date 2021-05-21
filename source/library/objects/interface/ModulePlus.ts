/**
 * Abstract class for all custom modules.
 * @author BrianWasTaken
*/

import { AkairoModuleOptions, AkairoModule, CommandOptions, Category } from 'discord-akairo';
import { HandlerPlus } from './HandlerPlus';
import { Collection } from 'discord.js';
import { Lava } from 'lib/Lava';

/**
 * Object parameter to pass in your custom module constructor, if any.
*/
export interface ModulePlusOptions extends AkairoModuleOptions {
	/**
	 * The name of the module.
	*/
	name?: string;
}

/**
 * Abstract class for all custom modules.
 * @abstract
*/
export abstract class ModulePlus extends AkairoModule {
	public readonly category!: Category<string, this>;
	public readonly name: string;
	public handler!: HandlerPlus<this>;
	public client!: Lava;

	public constructor(id: string, options: ModulePlusOptions) {
		super(id, options);
		this.name = String(options.name) || null;
	}

	public reload!: () => this;
	public remove!: () => this;
}

export default ModulePlus;