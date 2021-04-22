import { Collection, MessageEmbed } from 'discord.js';
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

export type ItemReturn = string | IReturn;

export interface IReturn {
  content?: string;
  embed?: MessageEmbed;
  reply?: boolean;
}

export class Item extends AkairoModule {
  handler: ItemHandler<Item>;
  client: Lava;

  sellable: boolean;
  buyable: boolean;
  checks: ItemCheck;
  usable: boolean;
  emoji: string;
  info: ItemInfo;
  name: string;
  cost: number;

  constructor(id: string, opt: Partial<ItemOptions>) {
    const { category } = opt;
    super(id, { category });

    this.info = opt.info;
    this.cost = Number(opt.cost);
    this.buyable = Boolean(opt.buyable);
    this.sellable = Boolean(opt.sellable);
    this.usable = Boolean(opt.usable);
    this.emoji = opt.emoji;
    this.name = opt.name;
    this.checks = opt.checks;
  }

  findInv(inventory: InventorySlot[], item: this) {
    return inventory.find((i) => i.id === item.id);
  }

  use(msg: Context): ItemReturn | Promise<ItemReturn> {
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
    const { min, max } = config.item.discount;
    const discount = randomNumber(min, max);
    const item = randomInArray([...this.modules.values()]);

    return { discount, item, lastSale: Date.now() };
  }

  runSaleInterval() {
    return setTimeout(() => {
      const { discount, item, lastSale } = this.getSale();
      this.sale = { discount, lastSale, id: item.id };
      return this.runSaleInterval();
    }, this.saleInterval);
  }

  buy(amount: number, data: Document & CurrencyProfile, iid: string) {
    const item = this.modules.get(iid);
    const isSale = this.sale.id === item.id;
    const dPrice = Math.round(
      item.cost - item.cost * (this.sale.discount / 1e2)
    );
    const paid = amount * (isSale ? dPrice : item.cost);

    let inv = data.items.find((i) => i.id === item.id);
    data.pocket -= paid;
    inv.amount += amount;

    return data.save();
  }

  sell(amount: number, data: Document & CurrencyProfile, iid: string) {
    const item = this.modules.get(iid);
    const isSale = this.sale.id === item.id;
    const dPrice = Math.round(
      item.cost - item.cost * (this.sale.discount / 1e2)
    );
    const sold = Math.round(amount * ((isSale ? dPrice : item.cost) / 4));

    let inv = data.items.find((i) => i.id === item.id);
    data.pocket += sold;
    inv.amount -= amount;

    return data.save();
  }
}
