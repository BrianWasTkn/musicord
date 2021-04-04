import { Collection, MessageEmbed } from 'discord.js';
import { CurrencyProfile } from '@lib/interface/mongo/currency';
import { ItemOptions } from '@lib/interface/handlers/item';
import { MessagePlus } from '@lib/extensions/message';
import { Document } from 'mongoose';
import { Lava } from '@lib/Lava';
import { 
  AkairoHandlerOptions, 
  AkairoModuleOptions, 
  AkairoHandler, 
  AkairoModule, 
  Category 
} from 'discord-akairo';

export type ItemReturn = string | IReturn;

export interface IReturn {
  content?: string;
  embed?: MessageEmbed;
  reply?: boolean;
}

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

  constructor(id: string, opt: Partial<ItemOptions>) {
    const { category } = opt;
    super(id, { category });

    this.info = String(opt.info);
    this.cost = Number(opt.cost);
    this.buyable = Boolean(opt.buyable);
    this.sellable = Boolean(opt.sellable);
    this.usable = Boolean(opt.usable);
    this.emoji = opt.emoji;
    this.name = opt.name;
  }

  use(msg: MessagePlus): ItemReturn | Promise<ItemReturn> {
    return 'This item perhaps, is a work in progress :)';
  }
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

  buy(amount: number, data: Document & CurrencyProfile, iid: string) {
    const item = this.modules.get(iid);
    const paid = amount * item.cost;

    let inv = data.items.find((i) => i.id === item.id);
    data.pocket -= paid;
    inv.amount += amount;

    return data.save();
  }

  sell(amount: number, data: Document & CurrencyProfile, iid: string) {
    const item = this.modules.get(iid);
    const sold = Math.round(amount * (item.cost / 4));

    let inv = data.items.find((i) => i.id === item.id);
    data.pocket += sold;
    inv.amount -= amount;

    return data.save();
  }
}
