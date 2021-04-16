import { AkairoClient, AkairoModule, AkairoHandler } from 'discord-akairo';
import { CurrencyProfile } from './interface/mongo/currency';
import { Config, config } from '../config';
import { SpawnDocument } from './interface/mongo/spawns';
import { MessagePlus } from './extensions/message';
import { Collection } from 'discord.js';
import { promisify } from 'util';
import { argTypes } from './utility/types';
import { Util } from './utility/util';
import { join } from 'path';
import {
  ListenerHandler,
  LotteryHandler,
  CommandHandler,
  SpawnHandler,
  QuestHandler,
  ItemHandler,
  Listener,
  Command,
  Spawn,
  Quest,
  Item,
} from './handlers';

// def imports
import CurrencyFunc from './mongo/currency/functions';
import SpawnerFunc from './mongo/spawns/functions';
import mongoose from 'mongoose';
import chalk from 'chalk';

// ext structures
import './extensions/message';
import './extensions/user';

interface DB {
  currency: CurrencyFunc<CurrencyProfile>;
  spawns: SpawnerFunc<SpawnDocument>;
}

interface Handlers {
  emitter: ListenerHandler<Listener>;
  command: CommandHandler<Command>;
  lottery: LotteryHandler;
  spawn: SpawnHandler<Spawn>;
  quest: QuestHandler<Quest>;
  item: ItemHandler<Item>;
}

export class Lava extends AkairoClient {
  handlers: Handlers;
  config: Config;
  util: Util;
  db: DB = {
    currency: new CurrencyFunc<CurrencyProfile>(this),
    spawns: new SpawnerFunc<SpawnDocument>(this),
  };

  constructor(cfg: Config) {
    super({ ...cfg.discord, ...cfg.akairo });
    this.util = new Util(this);
    this.config = cfg;

    this.handlers = {
      emitter: new ListenerHandler<Listener>(this, {
        directory: join(__dirname, '..', 'src', 'emitters'),
      }),
      command: new CommandHandler<Command>(this, {
        directory: join(__dirname, '..', 'src', 'commands'),
        prefix: config.bot.prefix
      }),
      spawn: new SpawnHandler<Spawn>(this, {
        directory: join(__dirname, '..', 'src', 'spawns'),
      }),
      quest: new QuestHandler<Quest>(this, {
        directory: join(__dirname, '..', 'src', 'quests'),
      }),
      item: new ItemHandler<Item>(this, {
        directory: join(__dirname, '..', 'src', 'items'),
      }),
      lottery: new LotteryHandler(this)
    };
  }

  patch() {
    const { command, lottery, emitter, spawn, quest, item } = this.handlers;
    command.useListenerHandler(emitter);
    emitter.setEmitters({ command, lottery, emitter, spawn, quest, item });
    command.resolver.addTypes(argTypes(this));

    const handlers = {
      Emitter: emitter,
      Command: command,
      Spawn: spawn,
      Quest: quest,
      Item: item
    };

    for (const [e, handler] of Object.entries(handlers)) {
      handler
      .on('load', (mod: AkairoModule) => {
        this.util.console({
          klass: this.constructor.name,
          type: 'def',
          msg: `${e} ${mod.id} loaded.`
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
    this.patch();
    await this.connectDB();
    return super.login(token);
  }
}
