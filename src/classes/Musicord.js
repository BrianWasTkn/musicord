import { Client, Collection } from 'discord.js'
import { readdirSync } from 'fs'
import { join } from 'path'

export default class Musicord extends Client {
	constructor(client, player) {
		this.player = new Player(this, player);
		this.config = require('../config/config.js').default;
		this.utils = new (require('./Util.js'))(this);
		this.managers = new Collection();
		this.commands = new Collection();
		this.aliases = new Collection();
		this.cooldowns = new Collection();
		this.loadAll();
	}

	loadAll() {
		this.hydrateListeners();
		this.importCommands();
		this.handleManagers();
	}

	hydrateListeners() {
		try {
			/* Check every inch of emitters */
			const emitters = readdirSync(join(__dirname, '..', 'emitters'));
			emitters.forEach(async e => {
				if (e === 'discord') {
					const discordListener = readdirSync(join(__dirname, '..', 'emitters', e));
					discordListener.forEach(async l => {
						l = l.split('.')[0];
						this.on(l, (...args) => {
							new (require(join(__dirname, '..', 'emitters', e, l)).default)(this);
						});
					});
				} else {
					const playerListener = readdirSync(join(__dirname, '..', 'emitters', e));
					playerListener.forEach(l => {
						new (require(join(__dirname, '..', 'emitters', e, l)).default)(this);
					});
				}
			});

			/* Log it */
			this.utils.log('Musicord', 'console', 'hydrateListeners');
		} catch(error) {
			this.utils.log('Musicord', 'error', 'hydrateListeners', error);
		}
	}

	importCommands() {
		try {
			const commands = readdirSync(join(__dirname, '..', 'commands'));
			commands.forEach(i => {
				/* Function */
				const load = command => {
					this.commands.set(command.name, command);
					command.aliases.forEach(a => this.aliases.set(a, command));
				}
				/* Import */
				if (i.endsWith('.js')) {
					const command = new (require(join(__dirname, '..', 'commands', i)).default)(this);
					load(command);
				} else {
					const dir = readdirSync(join(__dirname, '..', 'commands', i));
					dir.forEach(c => {
						const command = new (require(join(__dirname, '..', 'commands', i, c)).default)(this);
						load(command);
					});
				}
			});

			this.utils.log('Musicord', 'console', 'importCommands');
		} catch(error) {
			this.utils.log('Musicord', 'error', 'importCommands', error);
		}
	}

	handleManagers() {
		try {
			const managers = readdirSync(join(__dirname, '..', 'managers'));
			managers.forEach(m => {
				m = m.split('.')[0];
				const manager = new (require(join(__dirname, '..', 'managers', m)).default)(this);
				this.managers.set(m, manager);
			});

			this.utils.log('Musicord', 'console', 'handleManagers');
		} catch(error) {
			this.utils.log('Musicord', 'error', 'handleManagers', error);
		}
	}
}