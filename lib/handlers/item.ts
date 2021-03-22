import type { Collection, Message } from 'discord.js';
import type { CurrencyProfile } from '@lib/interface/mongo/currency';
import type { ItemOptions } from '@lib/interface/handlers/item';
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

  use(msg: Message): any | Promise<any> {}
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
    u: string,
    iid: string
  ): Promise<{
    amount: number;
    data: Document<any> & CurrencyProfile;
    item: ItemModule;
    paid: number;
  }> {
    const { maxInventory: maxInv } = this.client.config.currency;
    const { fetch, remove } = this.client.db.currency;
    const item = this.modules.get(iid);
    const paid = amount * item.cost;

    let data = await fetch(u);
    let inv = data.items.find((i) => i.id === item.id);
    await remove(u, 'pocket', paid);
    inv.amount += amount;
    await data.save();

    return { data, amount, item, paid };
  }

  async sell(
    amount: number,
    u: string,
    i: string
  ): Promise<{
    amount: number;
    data: Document<any> & CurrencyProfile;
    item: ItemModule;
    sold: number;
  }> {
    const { add } = this.client.db.currency;
    const item = this.modules.get(i);
    const sold = amount * (item.cost / 4);
    const data = await add(u, 'pocket', sold);

    data.items.find((i) => i.id === item.id).amount -= amount;
    await data.save();
    return { data, amount, item, sold };
  }
}
