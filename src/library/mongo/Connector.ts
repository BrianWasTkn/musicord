import { CurrencyEndpoint, CurrencyModel } from '.';
import { SpawnEndpoint, SpawnModel } from '.';
import { CribEndpoint, CribModel } from '.';
import { LavaEndpoint, LavaModel } from '.';

import { LavaClient } from '..';
import { Base } from 'discord.js';

export declare interface Connector extends Base {
	/**
	 * The client instance for this bullshit.
	 */
	client: LavaClient;
}

/**
 * Our connector for all collections.
*/
export class Connector extends Base {
	/**
	 * Spawn Endpoint.
	*/
	public crib = new CribEndpoint(this.client, CribModel);

	/**
	 * Currency Endpoint.
	*/
	public currency = new CurrencyEndpoint(this.client, CurrencyModel);

	/**
	 * Lava Endpoint.
	 */
	public lava = new LavaEndpoint(this.client, LavaModel);

	/**
	 * Spawn Endpoint.
	*/
	public spawn = new SpawnEndpoint(this.client, SpawnModel);
}