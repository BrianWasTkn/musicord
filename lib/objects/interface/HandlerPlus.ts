/**
 * Abstract class for all custom handlers.
 * @author BrianWasTaken
*/

import { AkairoHandlerOptions, LoadPredicate, AkairoHandler, Category } from 'discord-akairo';
import { ModulePlus } from './ModulePlus';
import { Collection } from 'discord.js';
import { Lava } from 'lib/Lava';

/**
 * Object parameter to pass in your custom handler constructor, if any.
*/
export interface HandlerPlusOptions extends AkairoHandlerOptions {
    /**
     * Either use names when loading a module.
    */
    useNames?: boolean
}

/**
 * Interface for handler events.
*/
export interface HandlerEvents<Mod extends ModulePlus = ModulePlus> {
    /**
     * When a module was loaded.
     * @param {Mod} module the module
     * @param {?boolean} isReload the module
    */
    load: [module: Mod, isReload?: boolean];
    /**
     * When a module was removed.
     * @param {Mod} module the module
    */
    remove: [module: Mod];
}

/**
 * Abstract class for all custom handlers.
 * @abstract
*/
export abstract class HandlerPlus<Mod extends ModulePlus = ModulePlus> extends AkairoHandler {
    public readonly classToHandle!: new (...args: any[]) => Mod;
    public readonly useNames: boolean;
    public categories!: Collection<string, Category<string, Mod>>;
    public modules!: Collection<string, Mod>;
    public client!: Lava;

    /**
     * Constructor for this handler.
    */
    public constructor(client: Lava, options: HandlerPlusOptions) {
        super(client, options);
        this.useNames = Boolean(options.useNames);
    }

    public add: (filename: string) => Mod;
    public findCategory!: (name: string) => Category<string, Mod>;
    public load!: (thing: string | Function, isReload?: boolean) => Mod;
    public loadAll!: (directory?: string, filter?: LoadPredicate) => this;
    public reload!: (id: string) => Mod;
    public reloadAll!: () => this;
    public remove!: (id: string) => Mod;
    public removeAll!: () => this;
}

export default HandlerPlus;