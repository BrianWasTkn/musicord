import { CurrencyEndpoint, CurrencyModel } from '.';
import { SpawnEndpoint, SpawnModel } from '.';
import { Model, Document } from 'mongoose';
import { LavaClient } from '..';

export const Connect = (client: LavaClient) => ({
	currency: new CurrencyEndpoint(client, CurrencyModel),
	spawn: new SpawnEndpoint(client, SpawnModel)
});