import {
  MessageCollectorOptions,
  MessageCollector,
  CollectorFilter,
  GuildChannel,
  TextChannel,
  Collection,
  Message,
  Role,
} from 'discord.js';
import { AkairoHandler, ClientUtil } from 'discord-akairo';
import { CurrencyProfile } from '@lib/interface/mongo/currency'
import { InventorySlot } from '@lib/interface/handlers/item'
import { Document } from 'mongoose'
import { Effects } from './effects';
import { COLORS } from '../utility/constants';
import { Lava } from '../Lava';

import chalk from 'chalk';
import moment from 'moment';

export class Util extends ClientUtil {
  effects: Collection<string, Collection<string, Effects>>;
  events: Collection<string, string>;
  heists: Collection<string, Role>;
  client: Lava;

  constructor(client: Lava) {
    super(client);

    this.heists = new Collection();
    this.events = new Collection();
    this.effects = new Collection();

    for (const color of Object.keys(COLORS)) {
      require('discord.js').Constants.Colors[color.toUpperCase()] = COLORS[color];
    }
  }

  /**
   * Divides the items of an array into arrays (dankmemer.lol/source)
   * @param array An array with usually many items
   * @param size The number of items per array in return
   */
  paginateArray<T>(array: T[], size: number): T[][] {
    let result = [];
    let j = 0;
    for (let i = 0; i < Math.ceil(array.length / (size || 5)); i++) {
      result.push(array.slice(j, j + (size || 5)));
      j = j + (size || 5);
    }
    return result;
  }

  /**
   * Returns a random item from an array
   * @param array An array of anything
   */
  randomInArray = <T>(array: T[]): T => {
    return array[Math.floor(Math.random() * array.length)];
  }

  /**
   * Generates a random number
   * @param min The minimum number possible
   * @param max The maximum number possible
   */
  randomNumber = (min: number, max: number): number => {
    return Math.floor(Math.random() * (max - min + 1) + min);
  }

  /**
   * Generates a random decimal color resolvable
   */
  randomColor = (): number => {
    return Math.random() * 0xffffff;
  }

  isPromise = (something: any): boolean => {
    return (
      something &&
      typeof something.then === 'function' &&
      typeof something.catch === 'function'
    );
  }

  console = (args: { klass: string; type?: 'def' | 'err'; msg: string }): void => {
    const stamp = moment().format('HH:mm:ss');
    const log = (...args) => console.log(...args); // kek
    const {
      klass = this.client.constructor.name,
      type = 'def',
      msg = null,
    } = args;

    return log(
      chalk`{cyanBright [${stamp} => ${klass}]} {${
        type == 'err' ? 'red' : 'cyan'
      }Bright ${msg}}`
    );
  }

  /**
   * Delay for a specified amount of time
   * @param ms number in milliseconds
   */
  sleep = (ms: number): Promise<number> => {
    return new Promise((resolve: Function) =>
      this.client.setTimeout(() => resolve(ms), ms)
    );
  }

  updateEffects = async (userID: string, key: keyof Effects, val: number, it: string) => {
    const data = await this.client.db.currency.updateItems(userID);
    const slot = data.items.find(i => i.id === it);
    const eff = new Effects();

    if (slot.expire > Date.now() && slot.active) {
      (eff[key] as (v: number) => Effects)(val);
      const userEf = this.effects.get(userID);
      const t = new Collection<string, Effects>();
      if (!userEf) this.effects.set(userID, t);
      return this.effects.get(userID).set(slot.id, eff);
    } else {
      const useref = this.effects.get(userID);
      if (!useref) {
        const meh = new Collection<string, Effects>();
        meh.set(slot.id, new Effects())
        return this.effects.set(userID, meh);
      }

      if (slot.active) {
        slot.active = false;
        return await data.save();
      }
    }
  }
}
