import { AkairoClient, ListenerHandler, CommandHandler, Command, Listener } from 'discord-akairo'
import { Collection, Message, Role } from 'discord.js'
import { join } from 'path'
import { readdirSync } from 'fs'
import chalk from 'chalk'

import { Spawner } from './Spawner'
import { Util } from './Util'
import { Config } from '../typings'

/**
 * Extends the instance of AkairoClient
 * @exports @class LavaClient @extends AkairoClient
*/
export class LavaClient extends AkairoClient {
	public spawners: Collection<number, Spawner>;
	public config: Config;
	public utils: Util;
	public listenerHandler: ListenerHandler;	
	public commandHandler: CommandHandler;
	public constructor(config: Config) {
		super({
			ownerID: config.owners
		}, {
			disableMentions: 'everyone'
		});

		this.spawners = new Collection();
		this.config = config;
		this.utils = new Util(this);

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
			ignorePermissions: (_: Message, cmd: Command): boolean => {
				const { member, guild } = _;
				const staff = guild.roles.cache.find((r: Role): boolean => {
					return r.name.toLowerCase().includes('staff')
				});

				return member.roles.cache.has(staff.id);
			},
			ignoreCooldown: (_: Message, cmd: Command): boolean => {
				const { member, guild } = _;
				const staff = guild.roles.cache.find((r: Role): boolean => {
					return r.name.toLowerCase().includes('staff')
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
			this.utils.log('Spawner', 'main', `Spawner ${chalk.cyanBright(visuals.title)} loaded.`);
		});
	}

	/**
	 * Builds all listeners and commands
	 * @returns {Promise<void>}
	*/
	private async build(): Promise<void> {
		this.importSpawners();
		this.commandHandler.useListenerHandler(this.listenerHandler);
		this.listenerHandler.setEmitters({
			commandHandler: this.commandHandler,
			listenerHandler: this.listenerHandler,
			process
		});

		this.listenerHandler.on('load', (_: Listener, isReload: boolean): void => {
			this.utils.log('Emitter', 'main', `Emitter ${chalk.cyanBright(_.id)} loaded.`);
		});

		this.commandHandler.on('load', (_: Command, isReload: boolean): void => {
			this.utils.log('Command', 'main', `Command ${chalk.cyanBright(_.id)} loaded.`);
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