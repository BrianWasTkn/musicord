import type { CurrencyProfile } from '@lib/interface/mongo/currency';
import type { ItemOptions } from '@lib/interface/handlers/item';
import type { MessagePlus } from '@lib/extensions/message'
import type { Collection } from 'discord.js';
import type { Document } from 'mongoose';
import type { Lava } from '../Lava';
import {
  AkairoHandlerOptions,
  AkairoModuleOptions,
  AkairoHandler,
  AkairoModule,
  Category,
} from 'discord-akairo';

export class Item extends AkairoModule {
  handler: ItemHandler<Item>;

  sellable: boolean;
  buyable: boolean;
  client: Lava;
  usable: boolean;
  emoji: string;
  info: string;
  name: string;
  cost: number;

  constructor(id: string, opt: ItemOptions) {
    const { category } = opt;
    super(id, { category });

    this.info = String(opt.info);
    this.cost = Number(opt.cost);
    this.buyable = opt.buyable;
    this.sellable = opt.sellable;
    this.usable = opt.usable;
    this.emoji = opt.emoji;
    this.name = opt.name;
  }

  use(msg: MessagePlus): any | Promise<any> {}
}

export class ItemHandler<ItemModule extends Item> extends AkairoHandler {
  categories: Collection<string, Category<string, ItemModule>>;
  modules: Collection<string, ItemModule>;
  client: Lava;

  constructor(
    client: Lava,
    {
      directory = './src/items',
      extensions = ['.js', '.ts'],
      classToHandle = Item,
      automateCategories = true,
    }: AkairoHandlerOptions
  ) {
    super(client, {
      directory,
      classToHandle,
      automateCategories,
    });
  }

  async buy(
    amount: number,
    data: Document & CurrencyProfile,
    iid: string
  ) {
    const item = this.modules.get(iid);
    const paid = amount * item.cost;

    let inv = data.items.find((i) => i.id === item.id);
    data.pocket -= paid;
    inv.amount += amount;

    return data.save();
  }

  async sell(
    amount: number,
    data: Document & CurrencyProfile,
    iid: string
  ) {
    const item = this.modules.get(iid);
    const sold = Math.round(amount * (item.cost / 4));

    let inv = data.items.find((i) => i.id === item.id);
    data.pocket += sold;
    inv.amount -= amount;

    return data.save();
  }
}
