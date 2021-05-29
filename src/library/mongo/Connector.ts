import { CurrencyEndpoint, CurrencyModel } from '.';
import { SpawnEndpoint, SpawnModel } from '.';
import { LavaEndpoint, LavaModel } from '.';

import { LavaClient, Base } from '..';

/**
 * Our connector for all collections.
*/
export class Connector extends Base {
	/**
	 * Currency Endpoint.
	*/
	public currency = new CurrencyEndpoint(this.client, CurrencyModel);

	/**
	 * Spawn Endpoint.
	*/
	public spawn = new SpawnEndpoint(this.client, SpawnModel);

	/**
	 * Lava Endpoint.
	 */
	public lava = new LavaEndpoint(this.client, LavaModel);
}