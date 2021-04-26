import { Category, AkairoModuleOptions, AkairoHandlerOptions } from 'discord-akairo';
import { BaseHandler, BaseModule } from './Base';
import { Lava } from '../Lava';

export class Giveaway extends BaseModule {
  constructor(...args: [string, AkairoModuleOptions]) {
    super(...args);
  }
}

export class GiveawayHandler<
  Module extends Giveaway
> extends BaseHandler<Module> {
  constructor(...args: [Lava, AkairoHandlerOptions]) {
    const [
      client,
      {
        directory = './src/giveaway',
        extensions = ['.js', '.ts'],
        classToHandle = Giveaway,
        automateCategories = true,
      },
    ] = args;

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
