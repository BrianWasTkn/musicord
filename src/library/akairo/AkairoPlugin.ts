import { AbstractHandler, AbstractModule, LavaClient } from '.';
import { AkairoHandler, AkairoModule } from 'discord-akairo';

/**
 * Initiator for our handlers for this plugin.
 */
type PluginHandlerPredicate = (
	this: Plugin, 
	client: LavaClient
) => AbstractHandler | AkairoHandler;


export class Plugin {
	/**
	 * The binded abstract/akairohandler for this plugin.
	 */
	public _handler: PluginHandlerPredicate;
	/**
	 * The handler for this plugin.
	 */
	public handler: AkairoHandler | AbstractHandler;
	/**
	 * The client for this plugin.
	 */
	public client: LavaClient;
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
		this._handler = handler.bind(this);
		this.handler = null;
		this.client = null;
		this.name = name;
		this.id = name.toLowerCase();
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