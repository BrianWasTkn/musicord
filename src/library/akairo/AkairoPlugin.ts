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
	client: LavaClient;
}

export class Plugin extends Base {
	private readonly _handler: PluginHandlerPredicate;
	public handler: AkairoHandler | AbstractHandler;
	public name: string;
	public id: string;
	public constructor(name: string, handler: PluginHandlerPredicate) {
		super(null);
		Object.defineProperty(this, '_handler', { value: handler.bind(this) });
		this.id = name.toLowerCase();
		this.name = name;
	}

	public load() {
		this.handler = this._handler(this.client);
		this.handler.loadAll();
		return this;
	}

	public unload() {
		return this.handler.modules.size >= 1 ? this.handler.removeAll() : this.handler;
	}

	public reload() {
		return this.handler.modules.size >= 1 ? this.handler.reloadAll() : this.handler;
	}

	public get(mod: string) {
		return this.handler.modules.get(mod);
	}
}