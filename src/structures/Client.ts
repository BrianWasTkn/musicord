import { readdirSync } from 'fs'
import { Spawner } from './Spawner'
import { Utils } from './Util'
import { join } from 'path'
import mongoose from 'mongoose'
import chalk from 'chalk'

import {
	Message, Collection, Snowflake, GuildChannel
} from 'discord.js'
import {
	AkairoClient, ListenerHandler, CommandHandler,
	LavaListener, LavaCommand
} from 'discord-akairo'

import currency from '../models/Currency'
import guild from '../models/Guild'

/**
 * Extends the instance of AkairoClient
 * @exports @class LavaClient @extends AkairoClient
*/
export class LavaClient extends AkairoClient {
	public spawners: Collection<string, Spawner>;
	public queue: Collection<Snowflake, any>;
	public config: any;
	public util: Utils;
	public listenerHandler: ListenerHandler;	
	public commandHandler: CommandHandler;
	public constructor(config: any) {
		super({
			ownerID: config.bot.owners
		}, {
			disableMentions: 'everyone', 
			fetchAllMembers: false,
			ws: { 
				intents: [
					'GUILDS', 'GUILD_MESSAGES', 'GUILD_MEMBERS'
				] 
			}
		});

		// Connect on instantiation
		mongoose.connect(process.env.MONGO, {
			useNewUrlParser: true,
			useUnifiedTopology: true
		}).then(() => {});

		this.spawners = new Collection();
		this.queue = new Collection();
		this.config = config;
		this.util = new Utils(this);

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
		this.listenerHandler.on('load', (_: LavaListener, isReload: boolean): void => {
			this.util.log('Emitter', 'main', `Emitter ${chalk.cyanBright(_.id)} loaded.`);
		});
		this.commandHandler.on('load', (_: LavaCommand, isReload: boolean): void => {
			this.util.log('Command', 'main', `Command ${chalk.cyanBright(_.id)} loaded.`);
		});

		this.listenerHandler.loadAll();
		this.commandHandler.loadAll();
	}

	/**
	 * Logins our Bot
	 * @param {string} token the discord token
	 * @returns {Promise<string>}
	*/
	public async login(token: string): Promise<string> {
		await this._build();
		return super.login(token);
	}


	private createUser({ userID }: { userID: string }): any {
		const user = new currency({ userID });
		user.save();
		return user;
	}

	/**
	 * Fetch our User from DB
	 * @param {string} userID the id of the user
	 * @returns {*}
	*/
	public async fetchUser(userID: string): Promise<any> {
		const user = this.users.cache.get(userID);
		if (!user || user.bot) return false;
		const fetched = await currency.findOne({ userID: user.id });
		if (!fetched) return this.createUser({ userID: user.id });
		return fetched;
	}

	/**
	 * Add certain amount to someone else's data
	 * @param {string} userID the id of the user
	 * @param {number} amount the amount to be added
	 * @param {string} type the type to be added
	 * * pocket - pocket amount
	 * * vault - bank amount
	 * * space - bank space amount
	 * @returns {*}
	*/
	public async add(
		userID: string, 
		amount: number, 
		type: 'pocket' | 'vault' | 'space'
	): Promise<any> {
		const user = this.users.cache.get(userID);
		if (!user || user.bot) return false;
		const data = await currency.findOne({ userID: user.id });
		if (!data) {
			this.createUser({ userID: user.id });
			return this.add(user.id, amount, type);
		}

		data[type] += Number(amount);
		data.save();
		return data;
	}

	/**
	 * Subtract certain amount to someone else's data
	 * @param {string} userID the id of the user
	 * @param {number} amount the amount to be subtracted
	 * @param {string} type the type to be subtracted
	 * * pocket - pocket amount
	 * * vault - bank amount
	 * * space - bank space amount
	 * @returns {*}
	*/
	public async deduct(
		userID: string, 
		amount: number, 
		type: 'pocket' | 'vault' | 'space'
	): Promise<any> {
		const user = this.users.cache.get(userID);
		if (!user || user.bot) return false;
		const data = await currency.findOne({ userID: user.id });
		if (!data) {
			this.createUser({ userID: user.id });
			return this.add(user.id, amount, type);
		}

		data[type] -= Number(amount);
		data.save();
		return data;
	}
}