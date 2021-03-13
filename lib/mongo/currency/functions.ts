/**
 * Currency Functions
 * Author: brian
 */

import type { Snowflake, User } from 'discord.js';
import type { Model, Document } from 'mongoose';
import type { CurrencyProfile } from '@lib/interface/mongo/currency';
import type { InventorySlot } from '@lib/interface/handlers/item';
import type { CurrencyUtil } from '@lib/interface/mongo/currency';
import type { Lava } from '@lib/Lava';
import { utils } from './util';

import Currency from './model';

export default class CurrencyEndpoint<BaseDocument extends Document> {
  model: Model<Document<CurrencyProfile>>;
  utils: CurrencyUtil;
  bot: Lava;

  constructor(client: Lava) {
    this.utils = utils;
    this.model = Currency;
    this.bot = client;
  }

  async create(id: Snowflake): Promise<Document & BaseDocument> {
    const { id: userID }: User = await this.bot.users.fetch(id);
    const data = new this.model({ userID });
    await data.save();
    return data as Document & BaseDocument;
  }

  fetch = async (userID: Snowflake): Promise<Document & BaseDocument> => {
    let data = await this.model.findOne({ userID });
    return (!data ? await this.create(userID) : data) as Document &
      BaseDocument;
  }

  add = async (
    userID: Snowflake,
    key: keyof BaseDocument,
    amount: number
  ): Promise<Document & BaseDocument> => {
    const data = await this.fetch(userID);
    data[key as string] += amount;
    await data.save();
    return data;
  }

  remove = async (
    userID: Snowflake,
    key: keyof BaseDocument,
    amount: number
  ): Promise<Document & BaseDocument> => {
    const data = await this.fetch(userID);
    data[key as string] -= amount;
    await data.save();
    return data;
  }
}
