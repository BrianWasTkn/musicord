import { EventEmitter } from 'events';
import { Collection } from 'discord.js';
import { CommandHandler, Command } from '.';
import { Lava } from 'lib/Lava';
import {
  ListenerHandler as AkairoListenerHandler,
  Listener as AkairoListener,
  CommandHandlerOptions,
  AkairoHandlerOptions,
  AkairoModuleOptions,
  ListenerOptions,
  CommandOptions,
  AkairoHandler,
  AkairoModule,
  Category,
} from 'discord-akairo';

// export class ModdedHandler<Module extends ModdedModule<EventEmitter>> extends AkairoHandler {}
// export class ModdedModule<Emitter extends EventEmitter> extends AkairoModule {}

// interface HandlerEvents<H extends ModdedHandler, M> {
//   load: (mod: M, isReload: boolean) => any;
//   remove: (mod: M) => any;
// }

// export declare interface ModdedHandler<Module extends ModdedModule<EventEmitter>> {
//   on<U extends keyof HandlerEvents<this, Module>>(
//     event: U, listener: HandlerEvents<this, Module>[U]
//   ): this;

//   emit<U extends keyof HandlerEvents<this, Module>>(
//     event: U, ...args: Parameters<HandlerEvents<this, Module>[U]>
//   ): boolean;
// }

// // ty to https://stackoverflow.com/questions/39142858/declaring-events-in-a-typescript-class-which-extends-eventemitter
// interface ListenerHandlerEvents<H, M> extends HandlerEvents<H, M> {
//   load: (mod: M, isReload: boolean) => any;
//   remove: (mod: M) => any;
// }

// // ty to https://stackoverflow.com/questions/39142858/declaring-events-in-a-typescript-class-which-extends-eventemitter
// export declare interface ListenerHandler<Module extends Listener<EventEmitter>> extends ModdedHandler<ModdedModule<EventEmitter>> {
//   on<U extends keyof ListenerHandlerEvents<this, Module>>(
//     event: U, listener: ListenerHandlerEvents<this, Module>[U]
//   ): this;

//   emit<U extends keyof ListenerHandlerEvents<this, Module>>(
//     event: U, ...args: Parameters<ListenerHandlerEvents<this, Module>[U]>
//   ): boolean;
// }

// Mandate types for both mod and handler constructors
type HandlerConstructor = [Lava, AkairoHandlerOptions];
type ModConstructor = [
  string,
  ListenerOptions & { emitter: string | EventEmitter }
];

export class Listener<Emitter extends EventEmitter> extends AkairoListener {
  handler: ListenerHandler<this>;
  emitter: Emitter;
  client: Lava;

  constructor(...args: ModConstructor) {
    super(...args);
  }
}

export class ListenerHandler<Module extends Listener<EventEmitter>> extends AkairoListenerHandler {
  categories: Collection<string, Category<string, Module>>;
  modules: Collection<string, Module>;
  client: Lava;

  constructor(...args: HandlerConstructor) {
    const [
      client,
      {
        automateCategories = true,
        classToHandle = Listener,
        loadFilter = () => true,
        directory = './src/emitters',
      },
    ] = args;

    super(client, {
      automateCategories,
      classToHandle,
      loadFilter,
      directory,
    });
  }
}
