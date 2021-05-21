/**
 * Base class for all custom handlers.
 * @author BrianWasTaken
*/

import { AkairoHandlerOptions, AkairoHandler, AkairoModule, Category, LoadPredicate } from 'discord-akairo';
import { AbstractModule, LavaClient } from '.';
import { Collection } from 'discord.js';

/**
 * Object parameter to pass into our custom handler constructor. 
*/
export interface AbstractHandlerOptions extends AkairoHandlerOptions {
	/**
	 * Wether to use names, idk this is non sense tbh.
	*/
	useNames?: boolean;
}

export class AbstractHandler<Module extends AbstractModule = AbstractModule> extends AkairoHandler {
	// Core Properties
	public categories: Collection<string, Category<string, Module>>;
	public modules: Collection<string, Module>;
	public client: LavaClient;

	// Extra Options
	public useNames: boolean;
	public constructor(client: LavaClient, options: AbstractHandlerOptions) {
		super(client, options);
		this.useNames = options.useNames;
	}

	// Typed Methods
	public add: (filename: string) => Module;
    public findCategory: (name: string) => Category<string, Module>;
    public load: (thing: string | Function, isReload?: boolean) => Module;
    public loadAll: (directory?: string, filter?: LoadPredicate) => this;
    public reload: (id: string) => Module;
    public reloadAll: () => this;
    public remove: (id: string) => Module;
    public removeAll: () => this;
}