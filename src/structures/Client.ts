import { join } from 'path'
import chalk from 'chalk'
import mongoose from 'mongoose'

import currencyFN from './currency/functions'
import spawnsFN from './spawns/functions'

import { 
	AkairoClient,
	ListenerHandler, 
	CommandHandler 
} from 'discord-akairo'

import GiveawayHandler from './Giveaway'
import SpawnHandler from './spawns/handler'
import Spawn from './Spawn'
import Util from './Util'

/**
 * Extends the instance of AkairoClient
 * @exports @class LavaClient @extends AkairoClient
*/
export class Client extends AkairoClient implements Akairo.Client {
	public util: Akairo.Util;
	public db: Lava.DatabaseEndpoint;
	public config: Lava.Config;
	public listenerHandler: ListenerHandler;	
	public commandHandler: CommandHandler;
	public spawnHandler: Akairo.SpawnHandler;
	public giveawayManager: Akairo.GiveawayHandler;
	public constructor(config: Lava.Config) {
		super({ ownerID: config.bot.ownerID }, config.bot.clientOptions);
		
		// Basic Stuff
		this.config = config;
		this.util = new Util(this);
		this.db = { 
			currency: currencyFN(this),
			spawns: spawnsFN(this)
		};

		// Handlers
		this.giveawayManager = new GiveawayHandler(this);
		this.listenerHandler = new ListenerHandler(this, {
			directory: join(__dirname, '..', 'emitters')
		});
		this.spawnHandler = new SpawnHandler(this, {
			directory: join(__dirname, '..', 'spawns'),
			classToHandle: Spawn,
			automateCategories: true
		});
		this.commandHandler = new CommandHandler(this, {
			directory: join(__dirname, '..', 'commands'),
			prefix: config.bot.prefix,
			commandUtil: true,
			defaultCooldown: 1500,
			allowMention: true,
			handleEdits: true
		});
	}

	/**
	 * Builds all listeners and commands
	 * @returns {Promise<void>}
	*/
	public async handle(): Promise<void> {
		this.commandHandler.useListenerHandler(this.listenerHandler);
		this.listenerHandler.setEmitters({
			spawnHandler: this.spawnHandler,
			commandHandler: this.commandHandler,
			listenerHandler: this.listenerHandler
		});

		const handlers = [
			{ key: 'Emitter', handler: this.listenerHandler },
			{ key: 'Command', handler: this.commandHandler },
			{ key: 'Spawner', handler: this.spawnHandler },
		];
		for (const { handler, key } of handlers) {
			handler.on('load', (_) => {
				this.util.log(key, 'main', `${key} ${chalk.cyanBright(_.id)} loaded.`);
			});
		}

		this.listenerHandler.loadAll();
		this.commandHandler.loadAll();
		this.spawnHandler.loadAll();
	}

	public async connectDB(): Promise<void> {
		try {
			await mongoose.connect(process.env.MONGO, {
				useNewUrlParser: true,
				useUnifiedTopology: true
			});
		} catch(error) {
			this.util.log('Mongoose', 'error', error.message);
		}
	}

	/**
	 * Builds all handlers and logs the bot in
	 * @param {string} token the discord token
	 * @returns {Promise<string>}
	*/
	public async build(token: string = this.config.bot.token): Promise<string> {
		await this.handle();
		await this.connectDB();
		return super.login(token);
	}
}