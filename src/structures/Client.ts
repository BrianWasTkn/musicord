import { readdirSync } from 'fs'
import { join } from 'path'
import mongoose from 'mongoose'
import chalk from 'chalk'
import Lava from 'discord-akairo'
import discord from 'discord.js'

import { Spawner } from './Spawner'
import { Utils } from './Util'
import currency from './currency/functions'
import spawns from './spawns/functions'

/**
 * Extends the instance of AkairoClient
 * @exports @class LavaClient @extends AkairoClient
*/
export class Client extends Lava.AkairoClient implements Lava.Client {
	public spawners: discord.Collection<string, Lava.Spawner>;
	public queue: discord.Collection<discord.Snowflake, any>;
	public heists: discord.Collection<discord.Snowflake, discord.Role>;
	public config: any;
	public util: Lava.Utils;
	public db: Lava.DB;
	public listenerHandler: Lava.ListenerHandler;	
	public commandHandler: Lava.CommandHandler;
	public constructor(config: Lava.Config) {
		super(config.lava.akairo, config.lava.client);
		// Lava Things
		this.spawners = new discord.Collection();
		this.queue = new discord.Collection();
		this.heists = new discord.Collection();
		this.config = config;
		this.util = new Utils(this);
		this.db = { 
			currency: currency(this),
			spawns: spawns(this)
		};

		// Akairo Handlers
		this.listenerHandler = new Lava.ListenerHandler(this, {
			directory: join(__dirname, '..', 'emitters')
		});
		this.commandHandler = new Lava.CommandHandler(this, {
			directory: join(__dirname, '..', 'commands'),
			prefix: config.lava.prefix,
			commandUtil: true,
			defaultCooldown: 1500,
			allowMention: true,
			handleEdits: true
		});
	}

	/**
	 * Imports our Spawners
	 * @private @returns {void}
	*/
	public importSpawners(): void {
		const spawns = readdirSync(join(__dirname, '..', 'spawns'));
		spawns.forEach((s: string) => {
			const { config, visuals }: { config: Lava.SpawnConfig, visuals: Lava.SpawnVisuals } = require(join(__dirname, '..', 'spawns', s));
			this.spawners.set(visuals.title, new Spawner(this, config, visuals));
			this.util.log('Spawner', 'main', `Spawner ${chalk.cyanBright(visuals.title)} loaded.`);
		});
	}

	/**
	 * Builds all listeners and commands
	 * @private @returns {Promise<void>}
	*/
	public async build(): Promise<void> {
		this.importSpawners();
		this.commandHandler.useListenerHandler(this.listenerHandler);
		this.listenerHandler.setEmitters({
			process,
			commandHandler: this.commandHandler,
			listenerHandler: this.listenerHandler
		});

		// Handler Load events
		this.listenerHandler.on('load', (_: Lava.Listener, isReload: boolean): void => {
			this.util.log('Emitter', 'main', `Emitter ${chalk.cyanBright(_.id)} loaded.`);
		});
		this.commandHandler.on('load', (_: Lava.Command, isReload: boolean): void => {
			this.util.log('Command', 'main', `Command ${chalk.cyanBright(_.id)} loaded.`);
		});

		this.listenerHandler.loadAll();
		this.commandHandler.loadAll();
	}

	public async connectDB(): Promise<void> {
		await mongoose.connect(process.env.MONGO, {
			useNewUrlParser: true,
			useUnifiedTopology: true
		});
	}

	/**
	 * Logins our Bot
	 * @param {string} token the discord token
	 * @returns {Promise<string>}
	*/
	public async login(token: string = this.config.lava.token): Promise<string> {
		await this.build();
		await this.connectDB();
		return super.login(token);
	}
}