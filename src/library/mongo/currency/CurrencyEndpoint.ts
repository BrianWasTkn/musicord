/// <reference path="../../../typings/mongo.currency.d.ts" />

import { MongooseEndpoint } from '../MongooseEndpoint';
import { CurrencyEntry } from '.';

export class CurrencyEndpoint extends MongooseEndpoint<CurrencyData> {
	public async fetch(userID: string) {
		return this.model.findOne({ userID }).then(doc => {
			if (!doc) return new this.model({ userID }).save();
			return doc as CurrencyData;
		}).then(doc => new CurrencyEntry(doc));
	}
}