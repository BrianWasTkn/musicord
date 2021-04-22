import { Structures, User, Collection } from 'discord.js';
import { CurrencyProfile } from 'lib/interface/mongo/currency';
import { Document } from 'mongoose';
import { Effects } from 'lib/utility/effects';
import { Lava } from 'lib/Lava';

export class UserPlus extends User {
  client: Lava;

  constructor(client: Lava, data: object) {
    super(client, data);
  }

  get isBotOwner() {
    return this.client.isOwner(this.id);
  }
}

export default () => Structures.extend('User', () => UserPlus);
