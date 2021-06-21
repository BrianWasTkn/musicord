/**
 * Base class for all custom handlers.
 * @author BrianWasTaken
*/

import { AkairoHandlerOptions, AkairoHandler, AkairoModule, Category, LoadPredicate } from 'discord-akairo';
import { AbstractModule, LavaClient } from '.';
import { Collection } from 'discord.js';

export interface AbstractHandlerOptions extends AkairoHandlerOptions {
	/**
	 * Wether to emit all events for this handler.
	 */
	debug?: boolean;
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
	/**
	 * Remove the module from our modules collection.
	 */
	deregister: (mod: Module) => void;
	/**
	 * Find a category based from a given id.
	 */
	findCategory: (name: string) => Category<string, Module>;
	/**
	 * Load a module.
	 */
	load: (thing: string | Function, isReload?: boolean) => Module;
	/**
	 * Load all modules.
	 */
	loadAll: (directory?: string, filter?: LoadPredicate) => this;
	/**
	 * Patch all properties for the module.
	 */
	register: (mod: Module, filepath?: string) => void;
	/**
	 * Reload a module based from a given id.
	 */
	reload: (id: string) => Module;
	/**
	 * Remove a module from our modules collection.
	 */
	remove: (id: string) => Module;
}

export class AbstractHandler<Module extends AbstractModule = AbstractModule> extends AkairoHandler {
	/**
	 * Constructor for this handler.
	 */
	public constructor(client: LavaClient, options: AbstractHandlerOptions) {
		super(client, options);
		if (options.debug ?? process.env.DEV_MODE === 'true') {
			const listen = (message: string) => this.client.console.log('Akairo', message);
			this.on('load', (mod: AkairoModule) => listen(`${options.classToHandle.name} "${mod.id}" loaded.`));
			this.on('remove', (mod: AkairoModule) => listen(`${options.classToHandle.name} "${mod.id}" removed.`));
		}
	}
}