import type { MessagePlus } from '@lib/extensions/message';
import type { Collection } from 'discord.js';
import type { Lava } from '../Lava';
import {
  AkairoHandlerOptions,
  AkairoModuleOptions,
  AkairoHandler,
  AkairoModule,
  Category,
} from 'discord-akairo';

export class Giveaway extends AkairoModule {
  handler: GiveawayHandler<Giveaway>;
  client: Lava;

  constructor(id: string, opt: AkairoModuleOptions) {
    const { category } = opt;
    super(id, { category });
  }
}

export class GiveawayHandler<
  GiveawayModule extends Giveaway
> extends AkairoHandler {
  categories: Collection<string, Category<string, GiveawayModule>>;
  modules: Collection<string, GiveawayModule>;
  client: Lava;

  constructor(
    client: Lava,
    {
      directory = './src/giveaway',
      extensions = ['.js', '.ts'],
      classToHandle = Giveaway,
      automateCategories = true,
    }: AkairoHandlerOptions
  ) {
    super(client, {
      directory,
      classToHandle,
      automateCategories,
    });
  }

  init() {}
  generateStartEmbed() {}
  generateEndEmbed() {}
  generateRerollEmbed() {}
}
