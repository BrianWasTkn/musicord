import { BaseManager, Snowflake, Constructable, Collection, Base } from 'discord.js';
import { AbstractHandler, AbstractModule, LavaClient } from '..';

export abstract class AbstractManager<
	H extends AbstractHandler,
	K extends Snowflake, 
	Holds extends AbstractModule | Base,
	R extends (string | (AbstractModule | Base))
> extends BaseManager<K, Holds, R> {
	public readonly client: LavaClient;
	public readonly handler: H;
	public constructor(
		client: LavaClient, 
		handler: H,
		iterable: Iterable<any>, 
		holds: Constructable<Holds>,
		cacheType?: Collection<K, Holds>
	) { super(client, iterable, holds, cacheType);
		/**
		 * The akairo handler for this manager.
		 * @readonly
		*/
		Object.defineProperty(this, 'handler', { value: handler });
	}

	public reloadModules() {
		return this.handler.reloadAll();
	}

	public removeModules() {
		return this.handler.removeAll();
	}
}