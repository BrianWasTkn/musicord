import { ItemOptions } from '@lib/interface/handlers/item';
import { Collection } from 'discord.js';
import { Lava } from '../Lava';
import {
  AkairoHandlerOptions,
  AkairoModuleOptions,
  AkairoHandler,
  AkairoModule,
  AkairoError,
} from 'discord-akairo';

export class ItemHandler extends AkairoHandler {
  modules: Collection<string, Item>;
  client: Lava;

  constructor(client: Lava, opt: { directory?: string }) {
    super(client, {
      automateCategories: true,
      classToHandle: Item,
      directory: opt.directory,
      extensions: ['.js', '.ts'],
    });
  }
}

export class Item extends AkairoModule {
  sellable: boolean;
  buyable: boolean;
  client: Lava;
  usable: boolean;
  emoji: string;
  info: string;
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
  }
}
