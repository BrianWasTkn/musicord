/**
 * Currency Functions
 * Author: brian
 */

import type { Snowflake, User } from 'discord.js';
import type { Model, Document } from 'mongoose';
import type { InventorySlot } from 'lib/interface/handlers/item';
import type { CurrencyUtil } from 'lib/interface/mongo/currency';
import type { Lava } from 'lib/Lava';
import { utils } from './util';

import Currency from './model';

export default class CurrencyEndpoint<Profile extends CurrencyProfile> {
  model: Model<Document<CurrencyProfile>>;
  utils: CurrencyUtil;
  bot: Lava;

  constructor(client: Lava) {
    this.utils = utils;
    this.model = Currency;
    this.bot = client;
  }

  fetch = async (userID: Snowflake): Promise<Profile> => {
    const data = ((await this.model.findOne({ userID })) ||
      new this.model({ userID })) as Profile;

    for (const item of this.bot.handlers.item.modules.array()) {
      const inv = data.items.find((i) => i.id === item.id);
      if (!inv) {
        const expire = 0,
          amount = 0,
          multi = 0,
          id = item.id;
        data.items.push({ expire, amount, multi, id });
      }
    }

    return data.save() as Promise<Profile>;
  };
}
