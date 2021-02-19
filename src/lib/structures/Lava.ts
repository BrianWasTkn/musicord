import {
    AkairoClient,
    AkairoModule,
    ListenerHandler,
    AkairoHandlerOptions,
    CommandHandler,
    CommandHandlerOptions,
} from 'discord-akairo'
import { join } from 'path'

import dbCurrency from './currency/functions'
import dbSpawn from './spawns/functions'
import Spawn from './Spawn'
import SpawnHandler from '../handlers/SpawnHandler'
import mongoose from 'mongoose'
import chalk from 'chalk'
import Util from './Util'

export default class Lava extends AkairoClient implements Akairo.Client {
    public config: Lava.Config
    public handlers: Akairo.Handlers
    public db: Lava.DatabaseEndpoint
    public util: Util

    constructor(args: Lava.Konstructor) {
        super(
            { ownerID: args.ownerID },
            {
                fetchAllMembers: false,
                disableMentions: 'everyone',
                ws: { intents: args.intents },
            }
        )

        this.config = args.config
        this.util = new Util(this)
        this.db = {
            currency: { ...dbCurrency(this) },
            spawns: { ...dbSpawn(this) },
        }
        this.handlers = {
            emitter: new ListenerHandler(this, this.listenerHandlerOptions),
            command: new CommandHandler(this, this.commandHandlerOptions),
            spawn: new SpawnHandler(this, this.spawnHandlerOptions),
        }
    }

    private async _patch(): Promise<void> {
        this.handlers.command.useListenerHandler(this.handlers.emitter)
        this.handlers.emitter.setEmitters({
            spawnHandler: this.handlers.spawn,
            commandHandler: this.handlers.command,
            listenerHandler: this.handlers.emitter,
        })

        const handlers = [
            { e: 'Emitter', emmiter: this.handlers.emitter },
            { e: 'Command', emmiter: this.handlers.command },
            { e: 'Spawner', emmiter: this.handlers.spawn },
        ]

        for (const { e, emmiter } of handlers) {
            emmiter.on('load', (module: AkairoModule) => {
                this.util.log(
                    'Lava',
                    'main',
                    `${e} ${chalk.cyanBright(module.id)} loaded.`
                )
            })
        }

        this.handlers.emitter.loadAll()
        this.handlers.command.loadAll()
        this.handlers.spawn.loadAll()
    }

    private get listenerHandlerOptions(): AkairoHandlerOptions {
        return {
            directory: join(__dirname, '..', '..', 'modules', 'emitters'),
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
            directory: join(__dirname, '..', '..', 'modules', 'commands'),
            prefix: this.config.bot.prefix,
            commandUtil: true,
            defaultCooldown: 1500,
            allowMention: true,
            handleEdits: true,
        }
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
                this.util.log('Lava', 'main', `Mongoose: ${mongo.version}`)
            })
            .catch((err) => {
                this.util.log('Lava', 'error', err.message, err)
                process.exit(1)
            })
    }

    async build(token: string = this.config.bot.token): Promise<string> {
        await this._patch()
        await this._connectDB(process.env.MONGO)
        return this.login(token)
    }
}
