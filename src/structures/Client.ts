import { readdirSync } from 'fs'
import { Spawner } from './Spawner'
import { Utils } from './Util'
import { join } from 'path'
import mongoose from 'mongoose'
import chalk from 'chalk'
import dbCur from './db/dbCurrency'
import dbSpn from './db/dbSpawn'

import {
	Message, Collection, Snowflake, GuildChannel,
	Role
} from 'discord.js'
import {
	AkairoClient, ListenerHandler, CommandHandler,
	LavaClient as ClientLava, DBInterface,
	Listener, Command
} from 'discord-akairo'

/**
 * Extends the instance of AkairoClient
 * @exports @class LavaClient @extends AkairoClient
*/
export class LavaClient extends AkairoClient implements ClientLava {
	public spawners: Collection<string, Spawner>;
	public queue: Collection<Snowflake, any>;
	public heists: Collection<Snowflake, Role>;
	public config: any;
	public util: Utils;
	public db: DBInterface
	public listenerHandler: ListenerHandler;	
	public commandHandler: CommandHandler;
	public constructor(config: any) {
		super({
			ownerID: config.bot.owners
		}, {
			disableMentions: 'everyone', 
			fetchAllMembers: false,
			ws: { intents: [
				'GUILDS', 'GUILD_MESSAGES', 'GUILD_MEMBERS'
			]}
		});

		// Lava Things
		this.spawners = new Collection();
		this.queue = new Collection();
		this.heists = new Collection();
		this.config = config;
		this.util = new Utils(this);
		this.db = { 
			currency: dbCur(this),
			spawns: dbSpn(this)
		};

		// Akairo Handlers
		this.listenerHandler = new ListenerHandler(this, {
			directory: join(__dirname, '..', 'emitters')
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
	 * Imports our Spawners
	 * @private @returns {void}
	*/
	private _importSpawners(): void {
		const spawns = readdirSync(join(__dirname, '..', 'spawns'));
		spawns.forEach((s: string) => {
			const { config, visuals } = require(join(__dirname, '..', 'spawns', s));
			this.spawners.set(visuals.title, new Spawner(this, config, visuals));
			this.util.log('Spawner', 'main', `Spawner ${chalk.cyanBright(visuals.title)} loaded.`);
		});
	}

	/**
	 * Builds all listeners and commands
	 * @private @returns {Promise<void>}
	*/
	private async _build(): Promise<void> {
		this._importSpawners();
		this.commandHandler.useListenerHandler(this.listenerHandler);
		this.listenerHandler.setEmitters({
			process,
			commandHandler: this.commandHandler,
			listenerHandler: this.listenerHandler
		});

		// Handler Load events
		this.listenerHandler.on('load', (_: Listener, isReload: boolean): void => {
			this.util.log('Emitter', 'main', `Emitter ${chalk.cyanBright(_.id)} loaded.`);
		});
		this.commandHandler.on('load', (_: Command, isReload: boolean): void => {
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
	public async login(token: string): Promise<string> {
		await this._build();
		await this.connectDB();
		return super.login(token);
	}
}