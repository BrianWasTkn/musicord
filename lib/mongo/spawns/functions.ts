/**
 * Currency Functions
 * Author: brian
 */

import type { Snowflake, User } from 'discord.js';
import type { Model, Document } from 'mongoose';
import type { SpawnDocument } from '@lib/interface/mongo/spawns';
import type { CurrencyUtil } from '@lib/interface/mongo/currency';
import type { Lava } from '@lib/Lava';

import Spawn from './model';

export default class SpawnEndpoint<BaseDocument extends Document> {
  model: Model<Document<SpawnDocument>>;
  bot: Lava;

  constructor(client: Lava) {
    this.model = Spawn;
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
    return (!data._id ? await this.create(userID) : data) as Document &
      BaseDocument;
  };

  add = async (
    userID: Snowflake,
    key: keyof BaseDocument,
    amount: number
  ): Promise<Document & BaseDocument> => {
    const data = await this.fetch(userID);
    data[key as string] += amount;
    await data.save();
    return data;
  };

  remove = async (
    userID: Snowflake,
    key: keyof BaseDocument,
    amount: number
  ): Promise<Document & BaseDocument> => {
    const data = await this.fetch(userID);
    data[key as string] -= amount;
    await data.save();
    return data;
  };
}
