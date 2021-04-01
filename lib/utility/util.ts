import { AkairoHandler, ClientUtil } from 'discord-akairo';
import { CurrencyProfile } from '@lib/interface/mongo/currency';
import { InventorySlot } from '@lib/interface/handlers/item';
import { Document } from 'mongoose';
import { Effects } from './effects';
import { COLORS } from '../utility/constants';
import { Lava } from '../Lava';
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

import chalk from 'chalk';
import moment from 'moment';

export class Util extends ClientUtil {
  cmdQueue: Collection<string, boolean>;
  effects: Collection<string, Collection<string, Effects>>;
  events: Collection<string, string>;
  heists: Collection<string, Role>;
  client: Lava;

  constructor(client: Lava) {
    super(client);

    this.heists = new Collection();
    this.events = new Collection();
    this.effects = new Collection();
    this.cmdQueue = new Collection();

    for (const color of Object.keys(COLORS)) {
      require('discord.js').Constants.Colors[color.toUpperCase()] =
        COLORS[color];
    }
  }

  /**
   * Divides the items of an array into arrays (dankmemer.lol/source)
   * @param array An array with usually many items
   * @param size The number of items per array in return
   */
  paginateArray = <T>(array: T[], size?: number): T[][] => {
    let result = [];
    let j = 0;
    for (let i = 0; i < Math.ceil(array.length / (size || 5)); i++) {
      result.push(array.slice(j, j + (size || 5)));
      j = j + (size || 5);
    }
    return result;
  };

  /**
   * Returns a random item from an array
   * @param array An array of anything
   */
  randomInArray = <T>(array: T[]): T => {
    return array[Math.floor(Math.random() * array.length)];
  };

  /**
   * Generates a random number
   * @param min The minimum number possible
   * @param max The maximum number possible
   */
  randomNumber = (min: number, max: number): number => {
    return Math.floor(Math.random() * (max - min + 1) + min);
  };

  /**
   * Generates a random decimal color resolvable (what?)
   */
  randomColor = (): number => {
    return Math.random() * 0xffffff;
  };

  codeBlock = (lang: string = 'js', content: string): string => {
    return `${'```'}${lang}\n${content}\n${'```'}`;
  };

  tableSlots = (emojis: { [slot: string]: [number, number, boolean] }) => {
    return 'haha u suck at coding';
  };

  // dankmemer.lol/source
  parseTime = (time: number): string[] => {
    const methods = [
      { name: 'days', count: 86400 },
      { name: 'hours', count: 3600 },
      { name: 'minutes', count: 60 },
      { name: 'seconds', count: 1 },
    ];

    const timeStr = [
      Math.floor(time / methods[0].count).toString() + ' ' + methods[0].name,
    ];
    for (let i = 0; i < 3; i++) {
      const calced = Math.floor(
        (time % methods[i].count) / methods[i + 1].count
      );
      timeStr.push(calced.toString() + ' ' + methods[i + 1].name);
    }

    return timeStr.filter((g) => !g.startsWith('0'));
  };

  isPromise = (something: any): boolean => {
    return (
      something &&
      typeof something.then === 'function' &&
      typeof something.catch === 'function'
    );
  };

  console = (args: {
    klass?: string;
    type?: 'def' | 'err';
    msg: string;
  }): void => {
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
  };

  /**
   * Delay for a specified amount of time
   * @param ms number in milliseconds
   */
  sleep = (ms: number): Promise<number> => {
    return new Promise((resolve: Function) =>
      this.client.setTimeout(() => resolve(ms), ms)
    );
  };
}
