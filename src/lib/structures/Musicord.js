import { Client, Collection, ClientPresence } from 'discord.js'
import { readdirSync } from 'fs'
import { join } from 'path'

import DisTube from './DisTube'

/**
 * Represents a Musicord client extending Client
 * @class @extends client
 */
export default class Musicord extends Client {
	/**
	 * The base constructor for Musicord
	 * @param {ClientOptions} clientOptions Discord.Client options
	 * @param {DisTubeOptions} playerOptions DisTube options
	 */
	constructor(clientOptions, playerOptions) {
		super(clientOptions);

		/**
		 * Bot Presence
		 * @type {ClientPresence}
		 */
		this.presence = new ClientPresence(this, {
			client_status: {
				web: 'offline',
				mobile: 'online',
				desktop: 'offline'
			}
		});

		/**
		 * Bot Package
		 * @type {Object}
		 */
		this.package = require('../../../package.json');

		/**
		 * DisTube Player
		 * @type {DisTube}
		 */
		this.distube = new DisTube(this, playerOptions);

		/**
		 * The main config
		 * @type {Object}
		 */
		this.config = require('../../config/default.js').default;

		/**
		 * Constants
		 * @type {Object}
		 */
		this.constants = require('./Constants.js');

		/**
		 * Musicord Utilities
		 * @type {Object}
		 */
		this.utils = new (require('./Util.js').default)(this);

		/**
		 * Musicord managers
		 * @type {Collection<string, Manager>}
		 */
		this.managers = new Collection();

		/**
		 * Musicord commands
		 * @type {Collection<string, Command>}
		 */
		this.commands = new Collection();

		/**
		 * Command Aliases
		 * @type {Collection<string, Command>}
		 */
		this.aliases = new Collection();

		/**
		 * Command Cooldowns
		 * @type {Collection<string, Collection<Snowflake, Number>}
		 */
		this.cooldowns = new Collection();
		this.loadAll();
	}

	get prefix() {
		return this.config.prefix;
	}

	get developers() {
		return this.config.developers(this).map(dev => dev.id);
	}

	/**
	 * Loads all functions
	 * @returns {void}
	 */
	loadAll() {
		this.utils.log('Musicord', 'main', 'Launching Bot...');
		this.hydrateListeners();
		this.importCommands();
		this.handleManagers();
		this.loadExtras();
	}

	/**
	 * Starts listening for individual distube/discord events
	 * @returns {void}
	 */
	hydrateListeners() {
		try {
			let loaded = [];
			const emitters = readdirSync(join(__dirname, '..', 'emitters'));
			emitters.forEach(e => {
				const dir = readdirSync(join(__dirname, '..', 'emitters', e));
				dir.forEach(l => {
					const listener = new (require(join(__dirname, '..', 'emitters', e, l)).default)(this);
					loaded.push(listener);
				});
			});

			this.utils.log('Musicord', 'main', `${loaded.length} Listeners loaded`);
		} catch(error) {
			this.utils.log('Musicord', 'error', 'Error: HydrateListeners', error);
		}
	}

	/**
	 * Loads all available commands under the 'commands' folder
	 * @returns {void}
	 */
	importCommands() {
		try {
			const commands = readdirSync(join(__dirname, '..', '..', 'commands'));
			commands.forEach(i => {
				const sub = readdirSync(join(__dirname, '..', '..', 'commands', i));
				sub.forEach(cmd => {
					const command = new (require(join(__dirname, '..', '..', 'commands', i, cmd)).default)(this);
					this.commands.set(command.name, command);
					command.aliases.forEach(a => this.aliases.set(a, command));
				});
			});

			console.log(this.commands.array()[0]);
			this.utils.log('Musicord', 'main', `${this.commands.size} Commands Loaded`);
		} catch(error) {
			this.utils.log('Musicord', 'error', 'Error: ImportCommands', error);
		}
	}

	/**
	 * Handles and registers all managers
	 * @returns {void}
	 */
	handleManagers() {
		try {
			const managers = readdirSync(join(__dirname, '..', 'managers'));
			managers.forEach(m => {
				m = m.split('.')[0];
				const manager = new (require(join(__dirname, '..', 'managers', m)).default)(this);
				this.managers.set(m, manager);
			});

			this.utils.log('Musicord', 'main', `${this.managers.size} Managers loaded`);
		} catch(error) {
			this.utils.log('Musicord', 'error', 'Error: ManagersLoader', error);
		}
	}

	loadExtras() {
		/* Process Listeners */
		process.on('unhandledRejection', error => {
			this.utils.log('Musicord', 'process', 'Unhandled Rejection', error.stack);
		}).on('uncaughtException', error => {
			this.utils.log('Musicord', 'process', 'Uncaught Exception', error.stack);
			process.exit(1);
		});

		/* Prototypes */
		Object.defineProperty(Math, 'random', {
			value: (min, max) => {
				return min && max ? (Math.random() * (max - min + 1) + min) : Math.random();
			}
		});

		/* Client Functions */
		this.createMessage = async (channelID, ...message) => {
			await this.channels.cache.get(channelID).send(...message);
		}
	}
}