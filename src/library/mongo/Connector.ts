import { CurrencyEndpoint, CurrencyModel } from '.';
import { SpawnEndpoint, SpawnModel } from '.';

import { LavaClient } from '..';
import { Base } from 'discord.js';

/**
 * Our connector for all collections.
*/
export class Connector extends Base {
	public client: LavaClient;

	/**
	 * Currency Endpoint.
	*/
	public currency = new CurrencyEndpoint(this.client, CurrencyModel);

	/**
	 * Spawn Endpoint.
	*/
	public spawn = new SpawnEndpoint(this.client, SpawnModel);
}