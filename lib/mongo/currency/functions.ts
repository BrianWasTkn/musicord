/**
 * Currency Functions
 * Author: brian
 */

import type { Snowflake, User } from 'discord.js';
import type { Model, Document } from 'mongoose';
import type { CurrencyUtil } from './util';
import type { Lava } from 'lib/Lava';
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

  public fetch = async (userID: Snowflake): Promise<Profile> => {
    const data = ((await this.model.findOne({ userID })) || new this.model({ userID })) as Profile;
    for (const item of [...this.lava.handlers.item.modules.values()]) {
      if (!data.items.find((i) => i.id === item.id)) {
        const expire = 0, amount = 0, multi = 0, id = item.id, active = false;
        data.items.push({ expire, amount, active, multi, id });
      }
    }

    return data.save() as Promise<Profile>;
  };
}
