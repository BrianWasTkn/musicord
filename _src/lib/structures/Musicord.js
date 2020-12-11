import { Client, Collection, ClientPresence, Constants } from 'discord.js'
import { readdirSync } from 'fs'
import { join } from 'path'

import DisTube from './DisTube'

require('../discord/Message').default;
console.log(require('../discord/Message').default);

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
	async loadAll() {
		this.utils.log('Musicord', 'main', 'Launching Bot...');
		if (this.config.devMode) {
			this.utils.log('Musicord', 'main', 'Entering Developer mode...');
			this._loadDev();
			this.loadExtras();
		} else {
			this.hydrateListeners();
			this.importCommands();
			this.handleManagers();
			this.loadExtras();
		}
	}

	/**
	 * Enters Dev mode
	 * @returns <void>
	 */
	_loadDev() {
		/* Commands */
		readdirSync(join(__dirname, '..', '..', 'commands'))
		.forEach(dir => {
			readdirSync(join(__dirname, '..', '..', 'commands', dir))
			.forEach(cmd => {
				const command = new (require(join(__dirname, '..', '..', 'commands', dir, cmd)).default)(this);
				this.commands.set(command.name, command);
				command.aliases.forEach(alias => this.aliases.set(alias, command));
				this.utils.log('Musicord', 'main', `Command: "${command.name}" loaded.`);
			});
		});

		/* Player Events */
		for (const d of readdirSync(join(__dirname, '..', 'emitters', 'distube'))) {
			const i = new (require(join(__dirname, '..', 'emitters', 'distube', d)).default)(this);
			this.utils.log('Musicord', 'main', `DisTube: "${d.split('.')[0]}" emitter loaded.`);
		}

		/* Events */
		const { Events } = Constants;
		readdirSync(join(__dirname, 'events')).forEach(event => {
			this.on(event.split('.')[0], require(`./events/${event}`).run.bind(this));
		});
		this.on(Events.CLIENT_READY, async () => {
			this.utils.log('Musicord', 'main', `${this.user.tag} is now ready.`);
			this.user.setPresence({
				status: 'dnd',
				activity: {
					type: 'WATCHING',
					name: 'Developer Mode'
				}
			});
		}).on(Events.MESSAGE_CREATE, async msg => {
			const { author, channel, guild } = msg;

			if (!msg.content.startsWith(this.prefix)) return;
			if (!this.developers.includes(author.id)) return;

			const [cmd, ...args] = msg.content.slice(this.prefix.length).trim().split(/ +/g);
			const command = this.commands.get(cmd) || this.aliases.get(cmd);

			if (command) {
				await command.execute({ Bot: this, msg, args });
			} else {
				let nearCommands = [];
				this.commands
					.filter(c => c.name.toLowerCase().includes(cmd.toLowerCase()))
					.forEach(c => nearCommands.push(c));

				return msg.channel.send([
					':lock: Developer Mode',
					`No command(s) were found for "${cmd.toLowerCase()}".`,
					nearCommands.length > 0 ? `Did you mean: \`${nearCommands.join(', ')}\`?` : ''
				].join(' '));
			}
		});
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