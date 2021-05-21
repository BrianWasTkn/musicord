/**
 * Currency Functions
 * Author: brian
 */

import type { Snowflake, User } from 'discord.js';
import type { Model, Document } from 'mongoose';
import type { CurrencyUtil } from './util';
import type { Lava } from 'lib/Lava';
import { UserEntry } from 'lib/utility/entry';
import { utils } from './util';

import Currency from './model';

export default class CurrencyEndpoint<Profile extends CurrencyProfile> {
	public model: Model<Document<CurrencyProfile>>;
	public utils: CurrencyUtil;
	private lava: Lava;

	public constructor(client: Lava) {
		this.utils = utils;
		this.model = Currency;
		this.lava = client;
	}

	public fetchDocs = () => this.model.find({});
	public deleteAll = () => this.model.deleteMany();

	private fetchNew = (id: Snowflake) => this.fetch(id)
		.then(async profile => {
			const user = this.lava.users.cache.get(profile.userID)
				|| await this.lava.users.fetch(profile.userID);
			return new UserEntry(user, profile);
		});

	public fetch = (userID: Snowflake) => {
		return (this.model.findOne({ userID })
		.then((doc: Document<CurrencyProfile>) => {
			if (!doc) return ((new this.model({ userID })).save())
			for (const item of this.lava.handlers.item.modules.values()) {
				if (!(doc as Profile).items.find((i: Currency.InventorySlot) => i.id === item.id)) {
					const expire = 0, amount = 0, multi = 0, id = item.id, active = false;
					(doc as Profile).items.push({ expire, amount, active, multi, id });
				}
			}

			return doc as Profile;
		})) as Promise<Profile>;
	}
}
