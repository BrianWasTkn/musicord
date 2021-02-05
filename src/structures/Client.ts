import { join } from 'path'
import chalk from 'chalk'
import mongoose from 'mongoose'
import Lava from 'discord-akairo'
import GLava from 'discord-giveaways'
import discord from 'discord.js'

import { GiveawayHandler } from './Giveaway'
import { Utils } from './Util'
import SpawnHandler from './spawns/handler'
import Spawn from './Spawn'
import currencyFN from './currency/functions'
import spawnsFN from './spawns/functions'

/**
 * Extends the instance of AkairoClient
 * @exports @class LavaClient @extends AkairoClient
*/
export class Client extends Lava.AkairoClient implements Lava.Client {
	public heists: discord.Collection<discord.Snowflake, discord.Role>;
	public config: any;
	public util: Lava.Utils;
	public db: Lava.DB;
	public giveawayHandler: GLava.Manager;
	public listenerHandler: Lava.ListenerHandler;	
	public commandHandler: Lava.CommandHandler;
	public spawnHandler: Lava.SpawnHandler;
	public constructor(config: Lava.Config) {
		super(config.lava.akairo, config.lava.client);
		// Lava Things
		this.heists = new discord.Collection();
		this.config = config;
		this.util = new Utils(this);
		this.db = { 
			currency: currencyFN(this),
			spawns: spawnsFN(this)
		};

		// Handlers
		this.listenerHandler = new Lava.ListenerHandler(this, {
			directory: join(__dirname, '..', 'emitters')
		});
		this.spawnHandler = new SpawnHandler(this, {
			directory: join(__dirname, '..', 'spawns'),
			classToHandle: Spawn,
			automateCategories: true
		});
		this.giveawayHandler = new GiveawayHandler(this, {
			storage: false,
			updateCountdownEvery: 5000,
			hasGuildMembersIntent: true,
			default: {
				botsCanWin: false,
				exemptPermissions: ['MANAGE_MESSAGES', 'ADMINISTRATOR'],
				embedColor: '#f00101',
				reaction: '<:memecoin:717347901587587153>',
				messages: {
					giveaway: '**:tada: GIVEAWAY :tada:**',
					giveawayEnded: '**:tada: ENDED :tada:**',
					inviteToParticipate: '**React with 🎉 to join!**',
					timeRemaining: '**Time Remaining:** {duration}',
					hostedBy: '**Hosted by:** {user}',
					embedFooter: 'Example Footer'
				}
			},
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
	 * Builds all listeners and commands
	 * @returns {Promise<void>}
	*/
	public async build(): Promise<void> {
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