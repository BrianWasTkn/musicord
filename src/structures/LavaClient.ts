import { 
	AkairoClient, ListenerHandler, CommandHandler, BotConfig,
	LavaClient as Client, LavaCommand, LavaListener
} from 'discord-akairo'
import { 
	Collection, Message, 
	GuildChannel, Snowflake
} from 'discord.js'
import {
	Spawner
} from './Spawner'
import {
	Utils
} from './Util'

import { join } from 'path'
import { readdirSync } from 'fs'
import chalk from 'chalk'
/**
 * Extends the instance of AkairoClient
 * @exports @class LavaClient @extends AkairoClient
*/
export class LavaClient extends AkairoClient implements Client {
	public spawners: Collection<string, Spawner>;
	public queue: Collection<Snowflake, any>;
	public config: BotConfig;
	public util: Utils;
	public listenerHandler: ListenerHandler;	
	public commandHandler: CommandHandler;
	public constructor(config: BotConfig) {
		super({
			ownerID: config.owners
		}, {
			disableMentions: 'everyone'
		});

		this.spawners = new Collection();
		this.queue = new Collection();
		this.config = config;
		this.util = new Utils(this);

		this.listenerHandler = new ListenerHandler(this, {
			directory: join(__dirname, '..', 'emitters')
		});

		this.commandHandler = new CommandHandler(this, {
			directory: join(__dirname, '..', 'commands'),
			prefix: config.prefixes,
			commandUtil: true,
			defaultCooldown: 1500,
			allowMention: true,
			handleEdits: true,
			ignorePermissions: (_: Message, cmd: LavaCommand): boolean => {
				const { member, guild } = _;
				const staff = guild.roles.cache.find(({ name }: { name: String }): boolean => {
					return name.toLowerCase().includes('staff');
				});

				return member.roles.cache.has(staff.id);
			},
			ignoreCooldown: (_: Message, cmd: LavaCommand): boolean => {
				const { member, guild } = _;
				const staff = guild.roles.cache.find(({ name }: { name: String }): boolean => {
					return name.toLowerCase().includes('staff');
				});

				return member.roles.cache.has(staff.id);
			}
		});
	}

	/**
	 * Imports our Spawners
	 * @private @returns {void}
	*/
	private importSpawners(): void {
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
	private async build(): Promise<void> {
		this.importSpawners();
		this.commandHandler.useListenerHandler(this.listenerHandler);
		this.listenerHandler.setEmitters({
			commandHandler: this.commandHandler,
			listenerHandler: this.listenerHandler,
			process
		});

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
		await this.build();
		return super.login(token);
	}
}