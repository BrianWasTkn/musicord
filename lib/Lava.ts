import { AkairoClient, AkairoModule } from 'discord-akairo';
import { LavaUser, LavaUserManager } from './extensions/user';
import { Collection, UserManager } from 'discord.js';
import { CurrencyProfile } from './interface/mongo/currency';
import { Config, config } from '../config';
import { SpawnDocument } from './interface/mongo/spawns';
import { argTypes } from './utility/types';
import { Util } from './utility/util';
import { join } from 'path';
import {
  ListenerHandler,
  CommandHandler,
  SpawnHandler,
  ItemHandler,
  Listener,
  Command,
  Spawn,
  Item
} from './handlers'


// def imports
import CurrencyFunc from './mongo/currency/functions';
import SpawnerFunc from './mongo/spawns/functions';
import mongoose from 'mongoose';
import Distube from 'distube'
import chalk from 'chalk';

// ext structures
// import './extensions/user';

interface DB {
  currency: CurrencyFunc<CurrencyProfile>;
  spawns: SpawnerFunc<SpawnDocument>;
}

interface Handlers {
  emitter: ListenerHandler;
  command: CommandHandler<Command>;
  spawn: SpawnHandler<Spawn>;
  item: ItemHandler<Item>;
}

export class Lava extends AkairoClient {
  handlers: Handlers;
  player: Distube;
  config: Config;
  users: LavaUserManager;
  util: Util;
  db: DB = {
    currency: new CurrencyFunc<CurrencyProfile>(this),
    spawns: new SpawnerFunc<SpawnDocument>(this),
  };

  constructor(cfg: Config) {
    super({ ...cfg.discord, ...cfg.akairo });
    this.util = new Util(this);
    this.config = cfg;
    this.player = new Distube(this);
    this.handlers = {
      emitter: new ListenerHandler(this, {
        directory: join(__dirname, '..', 'src', 'emitters'),
      }),
      command: new CommandHandler<Command>(this, {
        directory: join(__dirname, '..', 'src', 'commands'),
      }),
      spawn: new SpawnHandler<Spawn>(this, {
        directory: join(__dirname, '..', 'src', 'spawns'),
      }),
      item: new ItemHandler<Item>(this, {
        directory: join(__dirname, '..', 'src', 'items'),
      }),
    };
  }

  private _patch(): void {
    const { player, handlers: { command, emitter, item, spawn } } = this;
    command.useListenerHandler(emitter);
    emitter.setEmitters({ spawn, command, emitter, item, player });
    command.resolver.addTypes(argTypes(this));

    const handlers = {
      Emitter: emitter,
      Command: command,
      Spawner: spawn,
      Item: item,
    };

    for (const [e, emitter] of Object.entries(handlers)) {
      emitter
        .on('load', (module: AkairoModule) => {
          this.util.console({
            msg: chalk`{whiteBright ${e} {cyanBright ${module.id}} loaded.}`,
            type: 'def',
            klass: 'Lava',
          });
        })
        .loadAll();
    }
  }

  async connectDB(): Promise<never | typeof import('mongoose')> {
    try {
      const { options, uri } = this.config.bot.mongo;
      const db = await mongoose.connect(uri, options);
      this.util.console({
        msg: `Mongoose v${db.version}`,
        type: 'def',
        klass: 'Lava',
      });

      return db;
    } catch (err) {
      this.util.console({
        msg: err.message,
        type: 'err',
        klass: 'Lava',
      });

      throw err;
      return process.exit(1);
    }
  }

  async build(token: string = this.config.bot.token): Promise<string> {
    this._patch();
    await this.connectDB();
    return this.login(token);
  }
}
