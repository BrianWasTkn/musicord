import { Collection, MessageEmbed, MessageOptions } from 'discord.js';
import { CurrencyProfile } from 'lib/interface/mongo/currency';
import { Document } from 'mongoose';
import { Context } from 'lib/extensions/message';
import config from 'config/index' ;
import { Lava } from 'lib/Lava';
import {
  InventorySlot,
  ItemSaleData,
  ItemOptions,
  ItemCheck,
  ItemInfo,
} from 'lib/interface/handlers/item';
import {
  AkairoHandlerOptions,
  AkairoHandler,
  AkairoModule,
  Category,
} from 'discord-akairo';

export type ItemReturn = string | IReturn | MessageOptions;

export interface IReturn {
  content?: string;
  embed?: MessageEmbed;
  reply?: boolean;
}

export class Item extends AkairoModule {
  handler: ItemHandler<Item>;
  client: Lava;

  showInventory: boolean;
  moddedPrice: number;
  showInShop: boolean;
  sellable: boolean;
  premium: boolean;
  buyable: boolean;
  checks: ItemCheck;
  usable: boolean;
  emoji: string;
  info: ItemInfo;
  tier: number;
  name: string;
  cost: number;

  constructor(id: string, opt: Partial<ItemOptions>) {
    const { category } = opt;
    super(id, { category });

    this.info = opt.info;
    this.tier = Number(opt.tier);
    this.cost = Number(opt.cost);
    this.buyable = Boolean(opt.buyable);
    this.sellable = Boolean(opt.sellable);
    this.premium = Boolean(opt.premium);
    this.usable = Boolean(opt.usable);
    this.emoji = opt.emoji;
    this.name = opt.name;
    this.moddedPrice = opt.premium
      ? opt.cost * 1000e6
      : opt.cost;
    this.showInShop = opt.showShop;
    this.showInventory = opt.showInventory;
    this.checks = [].concat(opt.checks || []);
  }

  findInv(inventory: InventorySlot[], item: this | Item = this) {
    return inventory.find((i) => i.id === item.id);
  }

  use(msg: Context): PromiseUnion<ItemReturn> {
    return 'This item perhaps, is a work in progress :)';
  }
}

export class ItemHandler<ItemModule extends Item> extends AkairoHandler {
  categories: Collection<string, Category<string, ItemModule>>;
  modules: Collection<string, ItemModule>;
  client: Lava;

  intIsRunning: boolean;
  saleInterval: number;
  ticked: boolean;
  sale: ItemSaleData;

  constructor(
    client: Lava,
    {
      directory = './src/items',
      classToHandle = Item,
      automateCategories = true,
    }: AkairoHandlerOptions
  ) {
    super(client, {
      directory,
      classToHandle,
      automateCategories,
    });

    this.prepare();
  }

  prepare() {
    return this.client.once('ready', () => {
      const { sleep } = this.client.util;
      const { interval } = config.item.discount;
      const { discount, item, lastSale } = this.getSale();
      this.sale = { discount, lastSale, id: item.id };
      this.saleInterval = interval;
      this.intIsRunning = false;
      this.ticked = false;
      const left = 60 - new Date().getMinutes();
      return this.tick(Boolean(left));
    });
  }

  tick(first: boolean) {
    let catchup = first;
    let now = new Date();

    if (!this.ticked) {
      this.client.util.console({
        type: 'def',
        klass: 'Item',
        msg: `Next Sale in ${60 - now.getSeconds()} Seconds.`,
      });
    }

    return setTimeout(async () => {
      // The 60-second tick
      now = new Date();

      // Immediate sale if catching up (let's say, bot login)
      if (catchup) {
        const { discount, item, lastSale } = this.getSale();
        this.sale = { discount, lastSale, id: item.id };
        catchup = false;
      }

      // Tick
      if (now.getSeconds() === 0) {
        if (!this.ticked) this.ticked = true;
      }

      // Roll Interval (only once)
      if (!this.intIsRunning && now.getMinutes() === 0 && this.ticked) {
        this.intIsRunning = true;
        this.runSaleInterval.call(this);
      }

      return this.tick(false);
    }, (60 - now.getSeconds()) * 1e3 - now.getMilliseconds());
  }

  getSale() {
    const { randomNumber, randomInArray } = this.client.util;
    const { min, max } = config.item.discount, discount = randomNumber(min, max);
    const item = randomInArray([...this.modules.values()].filter(m => !m.premium));

    return { discount, item, lastSale: Date.now() };
  }

  runSaleInterval() {
    return setTimeout(() => {
      const { discount, item, lastSale } = this.getSale();
      this.sale = { discount, lastSale, id: item.id };
      return this.runSaleInterval();
    }, this.saleInterval);
  }
}
