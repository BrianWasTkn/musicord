/// <reference path="../../../typings/mongo.currency.d.ts" />

import { MongooseEndpoint } from '..';
import { CurrencyEntry } from '.';

export class CurrencyEndpoint extends MongooseEndpoint<CurrencyData> {
	public async fetch(_id: string) {
		return this.model.findOne({ _id }).then(doc => {
			if (!doc) return new this.model({ _id }).save();
			return doc;
		}).then(doc => new CurrencyEntry(this.client, doc));
	}
}