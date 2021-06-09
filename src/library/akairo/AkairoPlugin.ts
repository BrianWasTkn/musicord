import { AbstractHandler, AbstractModule, LavaClient } from '.';
import { AkairoHandler, AkairoModule } from 'discord-akairo';
import { Base } from 'discord.js';

/**
 * Initiator for our handlers for this plugin.
 */
type PluginHandlerPredicate = (
	this: Plugin, 
	client: LavaClient
) => AbstractHandler | AkairoHandler;

export declare interface Plugin extends Base {
	/**
	 * The client for this plugin.
	 */
	client: LavaClient;
}

export class Plugin extends Base {
	/**
	 * The binded abstract/akairohandler for this plugin.
	 */
	private _handler: PluginHandlerPredicate;
	/**
	 * The handler for this plugin.
	 */
	public handler: AkairoHandler | AbstractHandler;
	/**
	 * The name of this plugin.
	 */
	public name: string;
	/**
	 * The lowercased name for this plugin.
	 */
	public id: string;

	/**
	 * Construct a plugin.
	 */
	public constructor(name: string, handler: PluginHandlerPredicate) {
		super(null);
		this._handler = handler.bind(this);
		this.id = name.toLowerCase();
		this.name = name;
	}

	/**
	 * Initiate the mother for this baby sucking bitch.
	 */
	public initClient(client: LavaClient) {
		return this.client = client;
	}

	/**
	 * Initiate the handler for this plugin.
	 */
	public initHandler() {
		return this.handler = this._handler(this.client);
	}

	/**
	 * Load this plugin together with it's modules.
	 */
	public load() {
		this.handler.loadAll();
		return this;
	}

	/**
	 * Unload all modules from the handler of this plugin.
	 */
	public unload() {
		return this.handler.modules.size >= 1 ? this.handler.removeAll() : this.handler;
	}

	/**
	 * Reload all modfuckeries from the handler of this plugin.
	 */
	public reload() {
		return this.handler.modules.size >= 1 ? this.handler.reloadAll() : this.handler;
	}

	/**
	 * Get a module.
	 */
	public get(mod: string) {
		return this.handler.modules.get(mod);
	}
}