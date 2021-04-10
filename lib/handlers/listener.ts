import { Collection } from 'discord.js';
import { Lava } from '@lib/Lava';
import {
  ListenerHandler as AkairoListenerHandler,
  Listener as AkairoListener,
  AkairoHandlerOptions,
  ListenerOptions,
  Category,
} from 'discord-akairo';

export class Listener extends AkairoListener {
  handler: ListenerHandler<Listener>;
  client: Lava;

  constructor(id: string, options: ListenerOptions) {
    super(id, options);
  }
}

export class ListenerHandler<
  ListenerModule extends Listener
> extends AkairoListenerHandler {
  categories: Collection<string, Category<string, ListenerModule>>;
  modules: Collection<string, ListenerModule>;
  client: Lava;
  
  constructor(
    client: Lava,
    {
      classToHandle = Listener,
      directory = './src/emitters',
    }: AkairoHandlerOptions
  ) {
    super(client, {
      classToHandle,
      directory,
    });
  }
}
