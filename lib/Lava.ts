import mongoose from 'mongoose';
import chalk from 'chalk';
import { join } from 'path';
import {
  CommandHandlerOptions,
  AkairoHandlerOptions,
  ListenerHandler,
  CommandHandler,
  AkairoClient,
  AkairoModule,
} from 'discord-akairo';

// Import Template: import { Typed [, ...Module] } from 'somewhere'
import { dbCurrency, CurrencyFunction } from './mongo/currency/functions';
import { dbSpawn, SpawnFunction } from './mongo/spawns/functions';
import { SpawnHandler, Spawn } from './handlers/spawn';
import { ItemHandler, Item } from './handlers/item';
import { config, Config } from '../config';
import { Util } from './utility/util';

interface DB {
  currency: CurrencyFunction;
  spawns: SpawnFunction;
}

interface Handlers {
  emitter: ListenerHandler;
  command: CommandHandler;
  spawn: SpawnHandler;
  item?: ItemHandler; // optional for now
}

export class Lava extends AkairoClient {
  handlers: Handlers;
  config: Config;
  util: Util;
  db: DB;

  constructor(cfg: Config) {
    super(cfg.akairo, cfg.discord);

    this.config = cfg;
    this.util = new Util(this);
    this.db = {
      currency: { ...dbCurrency(this) },
      spawns: { ...dbSpawn(this) },
    };
    this.handlers = {
      emitter: new ListenerHandler(this, this.listenerHandlerOptions),
      command: new CommandHandler(this, this.commandHandlerOptions),
      spawn: new SpawnHandler(this, this.spawnHandlerOptions),
    };
  }

  private _patch(): void {
    this.handlers.command.useListenerHandler(this.handlers.emitter);
    this.handlers.emitter.setEmitters({
      spawnHandler: this.handlers.spawn,
      commandHandler: this.handlers.command,
      listenerHandler: this.handlers.emitter,
    });

    const handlers = [
      { e: 'Emitter', emitter: this.handlers.emitter },
      { e: 'Command', emitter: this.handlers.command },
      { e: 'Spawner', emitter: this.handlers.spawn },
    ];

    for (const { e, emitter } of handlers) {
      emitter.on('load', (module: AkairoModule) => {
        const msg = chalk`${e} {cyanBright ${module.id}} loaded.`;
        this.util.log('Lava', 'main', msg);
      });
    }

    this.handlers.emitter.loadAll();
    this.handlers.command.loadAll();
    this.handlers.spawn.loadAll();
  }

  private get listenerHandlerOptions(): AkairoHandlerOptions {
    return {
      directory: join(__dirname, '..', 'src', 'emitters'),
    };
  }

  private get spawnHandlerOptions(): AkairoHandlerOptions {
    return {
      directory: join(__dirname, '..', 'src', 'spawns'),
      classToHandle: Spawn,
      automateCategories: true,
    };
  }

  private get commandHandlerOptions(): CommandHandlerOptions {
    return {
      directory: join(__dirname, '..', 'src', 'commands'),
      // classToHandle: require('./Command').default,
      prefix: this.config.bot.prefix,
      commandUtil: true,
      defaultCooldown: 1500,
      allowMention: true,
      handleEdits: true,
    };
  }

  private async _connectDB(
    uri: string
  ): Promise<void | typeof import('mongoose')> {
    return mongoose
      .connect(uri, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      })
      .then((mongo: typeof mongoose) => {
        this.util.log('Lava', 'main', `Mongoose: ${mongo.version}`);
      })
      .catch((err) => {
        this.util.log('Lava', 'error', err.message, err);
        process.exit(1);
      });
  }

  async build(token: string = this.config.bot.token): Promise<string> {
    this._patch();
    await this._connectDB(process.env.MONGO);
    return this.login(token);
  }
}
