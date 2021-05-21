import { CurrencyEndpoint, CurrencyModel } from '.';
import { Model, Document } from 'mongoose';
import { LavaClient } from '..';

export const Connect = (client: LavaClient) => ({
	currency: new CurrencyEndpoint(client, CurrencyModel)
});