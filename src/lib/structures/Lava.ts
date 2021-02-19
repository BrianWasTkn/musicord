import { 
    AkairoClient,
    ListenerHandler,
    AkairoHandlerOptions, 
    CommandHandler,
    CommandHandlerOptions,
} from "discord-akairo";
import {
    join
} from 'path'

import dbCurrency from "./currency/functions";
import dbSpawn from "./spawns/functions";
import Spawn from './Spawn'
import SpawnHandler from '../handlers/SpawnHandler'
import mongoose from 'mongoose'
import Util from './Util'

export default class Lava extends AkairoClient implements Akairo.Client {
    public config: Lava.Config;
    public handlers: Akairo.Handlers;
    public db: Lava.DatabaseEndpoint;
    public util: Util;
    
    constructor(args: Lava.Konstructor) {
        super({ ownerID: args.ownerID }, {
            fetchAllMembers: false,
            disableMentions: 'everyone',
            ws: { intents: args.intents },
        })

        this.config = args.config;
        this.util = new Util(this);
        this._patch();
    }

    private async _patch(): Promise<void> {
        this.db.currency = { ...dbCurrency(this) };
        this.db.spawns = { ...dbSpawn(this) };

        this.handlers.emitter = new ListenerHandler(this, this.listenerHandlerOptions);
        this.handlers.command = new CommandHandler(this, this.commandHandlerOptions);
        this.handlers.spawn = new SpawnHandler(this, this.spawnHandlerOptions);

        this.handlers.command.useListenerHandler(this.handlers.emitter);
        await this._connectDB(process.env.MONGO);

        this.handlers.emitter.setEmitters({
            spawnHandler: this.handlers.spawn,
            commandHandler: this.handlers.command,
            listenerHandler: this.handlers.emitter
        });

        for (const handler in this.handlers) {
            if (Object.prototype.hasOwnProperty.call(this.handlers, handler)) {
                (this.handlers[handler] as Akairo.SpawnHandler | CommandHandler | ListenerHandler).loadAll();
            }
        }

        const handlers = [
            { id: 'Emitter', handler: this.handlers.emitter },
            { id: 'Command', handler: this.handlers.command },
            { id: 'Spawn', handler: this.handlers.spawn }
        ];

        for (const { id, handler } of handlers) {
            this.util.log(
                id, 
                'main',
                `${handler.modules.size} ${id}(s) loaded.`
            );
        }
    }
    
    private get listenerHandlerOptions(): AkairoHandlerOptions {
        return {
            directory: join(__dirname, '..', '..', 'modules', 'emitters')
        }
    }

    private get spawnHandlerOptions(): AkairoHandlerOptions {
        return {
            directory: join(__dirname, '..', '..', 'modules', 'spawns'),
            classToHandle: Spawn,
            automateCategories: true,
        }
    }

    private get commandHandlerOptions(): CommandHandlerOptions {
        return {
            directory: join(__dirname, '..', '..', 'modules', 'command'),
            prefix: this.config.bot.prefix,
            commandUtil: true,
            defaultCooldown: 1500,
            allowMention: true,
            handleEdits: true
        }
    }
    
    private async _connectDB(uri: string): Promise<void | typeof import("mongoose")> {
        return mongoose
        .connect(uri, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        })
        .then((mongo: typeof mongoose) => {
            this.util.log('Akairo ', 'main', `Mongoose: ${mongo.version}`)
        })
        .catch(err => {
            this.util.log('Akairo ', 'error', err.message, err);
            process.exit(1);
        });
    }

    async build(token: string = this.config.bot.token): Promise<string> {
        await this._patch();
        return this.login(token);
    }
}