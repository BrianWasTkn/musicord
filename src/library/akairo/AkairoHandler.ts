/**
 * Base class for all custom handlers.
 * @author BrianWasTaken
*/

import { AkairoHandlerOptions, AkairoHandler, AkairoModule, Category, LoadPredicate } from 'discord-akairo';
import { AbstractModule, LavaClient } from '.';
import { Collection } from 'discord.js';

export interface AbstractHandlerOptions extends AkairoHandlerOptions {
}

export declare interface AbstractHandler<Module extends AbstractModule = AbstractModule> extends AkairoHandler {
	/**
	 * The categories this handler load, containing a collection of modules.
	 */
	categories: Collection<string, Category<string, Module>>;
	/**
	 * The modules this handler hold.
	 */
	modules: Collection<string, Module>;
	/**
	 * The client for this handler.
	 */
	client: LavaClient;
}

export class AbstractHandler<Module extends AbstractModule = AbstractModule> extends AkairoHandler {
	/**
	 * Remove the module from our modules collection.
	 */
	public deregister: (mod: Module) => void;
	/**
	 * Find a category based from a given id.
	 */
	public findCategory: (name: string) => Category<string, Module>;
	/**
	 * Load a module.
	 */
	public load: (thing: string | Function, isReload?: boolean) => Module;
	/**
	 * Load all modules.
	 */
	public loadAll: (directory?: string, filter?: LoadPredicate) => this;
	/**
	 * Patch all properties for the module.
	 */
	public register: (mod: Module, filepath?: string) => void;
	/**
	 * Reload a module based from a given id.
	 */
	public reload: (id: string) => Module;
	/**
	 * Remove a module from our modules collection.
	 */
	public remove: (id: string) => Module;
}