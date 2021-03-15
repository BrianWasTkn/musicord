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
import { COLORS } from '../utility/constants';
import { Lava } from '../Lava';

import chalk from 'chalk';
import moment from 'moment';

export class Util extends ClientUtil {
  heists: Collection<string, Role>;
  events: Collection<string, string>;
  client: Lava;

  constructor(client: Lava) {
    super(client);

    this.heists = new Collection();
    this.events = new Collection();

    for (const color of Object.keys(COLORS)) {
      require('discord.js').Constants.Colors[color.toUpperCase()] = COLORS[color];
    }
  }

  /**
   * Divides the items of an array into arrays (dankmemer.lol/source)
   * @param array An array with usually many items
   * @param size The number of items per array in return
   */
  paginateArray(array: any[], size: number): Array<any[]> {
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
  randomInArray(array: any[]): any {
    return array[Math.floor(Math.random() * array.length)];
  }

  /**
   * Generates a random number
   * @param min The minimum number possible
   * @param max The maximum number possible
   */
  randomNumber(min: number, max: number): any {
    return Math.floor(Math.random() * (max - min + 1) + min);
  }

  /**
   * Generates a random decimal color resolvable
   */
  randomColor(): number {
    return Math.random() * 0xffffff;
  }

  isPromise(something: any): boolean {
    return (
      something &&
      typeof something.then === 'function' &&
      typeof something.catch === 'function'
    );
  }

  console(args: { klass: string; type?: 'def' | 'err'; msg: string }): void {
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
  sleep(ms: number): Promise<number> {
    return new Promise((resolve: Function) =>
      setTimeout(() => resolve(ms), ms)
    );
  }
}
