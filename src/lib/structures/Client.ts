import { join } from 'path'
import chalk from 'chalk'
import mongoose from 'mongoose'

import { 
	AkairoClient,
	ListenerHandler, 
	CommandHandler,
	AkairoModule
} from 'discord-akairo'

import SpawnHandler from '../handlers/SpawnHandler'
import Spawn from './Spawn'
import Util from './Util'

import currencyFN from './currency/functions'
import spawnsFN from './spawns/functions'
import giveawayFN from './giveaway/functions'

const __modDirs = join(__dirname, '..', '..', 'modules');
const commandDir = join(__modDirs, 'commands');
const listenerDir = join(__modDirs, 'emitters');
const spawnDir = join(__modDirs, 'spawns');

/**
 * Extends the instance of AkairoClient
 * @exports @class {Client} @extends {AkairoClient} @implements {Akairo.Client}
*/
export class Client extends AkairoClient implements Akairo.Client {
	public util: Akairo.Util;
	public db: Lava.DatabaseEndpoint;
	public config: Lava.Config;
	public listenerHandler: ListenerHandler;	
	public commandHandler: CommandHandler;
	public spawnHandler: Akairo.SpawnHandler;
	// public giveawayManager: Akairo.GiveawayHandler;
	public constructor(config: Lava.Config) {
		const { ownerID } = config.bot;
		super({ ownerID }, config.bot.clientOptions);
		
		// Basic Stuff
		this.config = config;
		this.util = new Util(this);
		this.db = { 
			currency: currencyFN(this),
			spawns: spawnsFN(this),
			giveaways: giveawayFN(this)
		};

		// Handlers
		this.listenerHandler = new ListenerHandler(this, {
			directory: listenerDir
		});
		this.spawnHandler = new SpawnHandler(this, {
			directory: spawnDir,
			classToHandle: Spawn,
			automateCategories: true
		});
		this.commandHandler = new CommandHandler(this, {
			directory: commandDir,
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

		const handlers = [{ 
			key: 'Emitter', handler: this.listenerHandler }, { 
			key: 'Command', handler: this.commandHandler }, { 
			key: 'Spawner', handler: this.spawnHandler 
		}];

		for (const { key, handler } of handlers) {
			handler.on('load', (e: AkairoModule) => {
				this.util.log(key, 'main', `${key} ${chalk.cyanBright(e.id)} loaded.`);
			});
		}

		this.listenerHandler.loadAll();
		this.commandHandler.loadAll();
		this.spawnHandler.loadAll();
	}

	/**
	 * connect lava into mongodb
	 * @returns {typeof mongoose | void}
	 */
	public async connectDB(): Promise<typeof mongoose | void> {
		try {
			const options: mongoose.ConnectionOptions = { 
				useNewUrlParser: true, 
				useUnifiedTopology: true
			};

			return await mongoose.connect(process.env.MONGO, options);
		} catch(error) {
			this.util.log('Mongoose', 'error', error.message);
			process.exit(1);
		}
	}

	/**
	 * Builds all handlers and logs the bot in
	 * @param {string} token the discord token
	 * @returns {Promise<string>}
	*/
	public async build(token: string = this.config.bot.token): Promise<string> {
		this.handle();
		await this.connectDB();
		return super.login(token);
	}
}