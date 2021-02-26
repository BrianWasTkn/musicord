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
import { Lava } from '../Lava';
import { Colors } from '../interface/utility';
import chalk from 'chalk';
import moment from 'moment';

export class Util extends ClientUtil {
  heists: Collection<string, Role>;
  events: Collection<string, string>;
  client: Lava;
  Colors: Colors;

  constructor(client: Lava) {
    super(client);

    this.heists = new Collection();
    this.events = new Collection();
    this.Colors = require('./constants').Colors;
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

  /**
   * Logs something into the console
   * @param struct The constructor name
   * @param type Either `main` or `error`
   * @param _ The message to be displayed
   * @param err An error object
   */
  log(struct: string, type: string, _: string, err?: Error): void {
    const stamp = moment().format('HH:mm:ss');
    switch (type) {
      case 'main':
        console.log(
          chalk.whiteBright(`[${stamp}]`),
          chalk.cyanBright(struct),
          chalk.whiteBright('=>'),
          chalk.yellowBright(_)
        );
        break;
      case 'error':
        console.log(
          chalk.whiteBright(`[${stamp}]`),
          chalk.redBright(struct),
          chalk.whiteBright('=>'),
          chalk.redBright(_),
          err
        );
        break;
      default:
        this.log(struct, 'main', _);
        break;
    }
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

  async collectMessageAndEmit(
    options: MessageCollectorOptions,
    filter: CollectorFilter,
    channel: TextChannel,
    event: string,
    handler: AkairoHandler
  ): Promise<MessageCollector> {
    const collector = channel.createMessageCollector(filter, options);
    collector.on('collect', (message: Message) =>
      handler.emit(`${event}Collect`, message)
    );
    collector.on('end', (collected: Collection<string, Message>) =>
      handler.emit(`${event}End`, collected)
    );
    return collector;
  }
}
