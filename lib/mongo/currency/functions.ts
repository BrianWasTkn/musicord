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

export default class CurrencyEndpoint<Profile extends CurrencyProfile> {
  model: Model<Document<CurrencyProfile>>;
  utils: CurrencyUtil;
  bot: Lava;

  constructor(client: Lava) {
    this.utils = utils;
    this.model = Currency;
    this.bot = client;
  }

  async create(id: Snowflake): Promise<Document & Profile> {
    const { id: userID }: User = await this.bot.users.fetch(id);
    const data = new this.model({ userID });
    await data.save();
    return data as Document & Profile;
  }

  fetch = async (userID: Snowflake): Promise<Document & Profile> => {
    let data = await this.model.findOne({ userID });
    return (!data ? await this.create(userID) : data) as Document & Profile;
  };

  add = async (
    userID: Snowflake,
    key: keyof Profile,
    amount: number
  ): Promise<Document & Profile> => {
    const data = await this.fetch(userID);
    data[key as string] += amount;
    await data.save();
    return data;
  };

  remove = async (
    userID: Snowflake,
    key: keyof Profile,
    amount: number
  ): Promise<Document & Profile> => {
    const data = await this.fetch(userID);
    data[key as string] -= amount;
    await data.save();
    return data;
  };

  updateItems = async (userID: Snowflake): Promise<Document & Profile> => {
    const items = this.bot.handlers.item.modules.array();
    const data = await this.fetch(userID);
    items.forEach((i) => {
      const filter = (it) => it.id === i.id;
      const isHere = data.items.find(filter);
      if (!isHere) {
        data.items.push({
          active: false,
          expire: 0,
          amount: 0,
          id: i.id,
        });
      }
    });

    await data.save();
    return data;
  };
}
