/**
 * Spawn Functions
 * Author: brian
 */

import type { Snowflake, User } from 'discord.js';
import type { Model, Document } from 'mongoose';
import type { SpawnDocument } from '@lib/interface/mongo/spawns';
import type { CurrencyUtil } from '@lib/interface/mongo/currency';
import type { Lava } from '@lib/Lava';

import Spawn from './model';

export default class SpawnEndpoint<Profile extends Document> {
  model: Model<Document<SpawnDocument>>;
  bot: Lava;

  constructor(client: Lava) {
    this.model = Spawn;
    this.bot = client;
  }

  fetch = async (userID: Snowflake): Promise<Document & Profile> => {
    const data = ((await this.model.findOne({ userID })) ||
      new this.model({ userID })) as Document & Profile;

    return data.save() as Promise<Document & Profile>;
  };

  add = async (
    userID: Snowflake,
    key: keyof Profile,
    amount: number
  ): Promise<Document & Profile> => {
    const data = await this.fetch(userID);
    data[key as string] += amount;
    return data.save();
  };

  remove = async (
    userID: Snowflake,
    key: keyof Profile,
    amount: number
  ): Promise<Document & Profile> => {
    const data = await this.fetch(userID);
    data[key as string] -= amount;
    return data.save();
  };
}
