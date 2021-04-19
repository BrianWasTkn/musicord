import {
  AkairoHandler,
  AkairoHandlerOptions,
  AkairoModule,
  LoadPredicate,
  Category,
} from 'discord-akairo';
import { Collection } from 'discord.js';
import { Lava } from '@lib/Lava';

export class BaseModule extends AkairoModule {
  category: Category<string, this>;
  handler: BaseHandler<this>;
  client: Lava;
}

export class BaseHandler<Mod extends BaseModule> extends AkairoHandler {
  categories: Collection<string, Category<string, Mod>>;
  modules: Collection<string, Mod>;
  client: Lava;

  add: (filename: string) => Mod;
  findCategory: (name: string) => Category<string, Mod>;
  load: (thing: string | Function, isReload?: boolean) => Mod;
  loadAll: (directory?: string, filter?: LoadPredicate) => this;
  reload: (id: string) => Mod;
  reloadAll: () => this;
  remove: (id: string) => Mod;
  removeAll: () => this;
}
