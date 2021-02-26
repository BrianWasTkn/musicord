import {
  AkairoClient,
  AkairoModule,
  ListenerHandler,
  AkairoHandlerOptions,
  CommandHandler,
  CommandHandlerOptions,
} from 'discord-akairo';
import { join } from 'path';

import dbCurrency from './currency/functions';
import dbSpawn from './spawns/functions';
import Spawn from './Spawn';
import SpawnHandler from '../handlers/SpawnHandler';
import mongoose from 'mongoose';
import chalk from 'chalk';
import Util from './Util';

export default class Lava extends AkairoClient implements Akairo.Client {
  public config: Lava.Config;
  public handlers: Akairo.Handlers;
  public db: Lava.DatabaseEndpoint;
  public util: Util;

  constructor(args: Lava.Konstructor) {
    super(
      { ownerID: args.ownerID },
      {
        fetchAllMembers: false,
        disableMentions: 'everyone',
        ws: { intents: args.intents },
      }
    );

    this.config = args.config;
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
      directory: join(__dirname, '..', '..', 'emitters'),
    };
  }

  private get spawnHandlerOptions(): AkairoHandlerOptions {
    return {
      directory: join(__dirname, '..', '..', 'spawns'),
      classToHandle: Spawn,
      automateCategories: true,
    };
  }

  private get commandHandlerOptions(): CommandHandlerOptions {
    return {
      directory: join(__dirname, '..', '..', 'commands'),
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
