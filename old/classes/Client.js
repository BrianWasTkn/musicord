import { Client, Collection } from 'discord.js'
import { join } from 'path'
import { readdirSync } from 'fs'
import chalk from 'chalk'

import { log } from '../utils/logger.js'
import DisTube from './Player.js'
import config from '../config.js'
import packageFile from '../../package.json'

class Musicord extends Client {
	constructor(discordOpts, playerOpts) {
		super(discordOpts);
		this.package = packageFile;
		this.config = config;
		this.player = new DisTube(this, playerOpts);
		this.commands = new Collection();
		this.aliases = new Collection();
		this.cooldowns = new Collection();
		this.loadAll();
	}

	/** Load Everythin' */
	loadAll() {
		try {
			this.hydrateListeners(this);
			log('main', 'Listeners Loaded');
			try {
				this.registerCommands();
				log('main', 'Commands Loaded');
			} catch(error) {
				log('error', 'Cannot register commands', error.stack);
				process.exit(1);
			}
		} catch(error) {
			log('error', 'Cannot load bot listeners', error.stack);
			process.exit(1);
		}
	}

	/** Listeners */
	hydrateListeners(bot) {
		/** Discord Listeners */
		const discord = readdirSync(join(__dirname, '..', 'emitters', 'discord'));
		discord.forEach(async e => {
			const event = new (require(`../emitters/discord/${e}`).default)(this);
			this.on(e.split('.')[0], async (...args) => {
				await event.run(...args);
			});
		});

		/** Player Listeners */
		const player = readdirSync(join(__dirname, '..', 'emitters', 'distube'));
		player.forEach(async e => {
			const event = new (require(`../emitters/distube/${e}`).default)(this);
			this.player.on(e.split('.')[0], async (...args) => {
				await event.run(...args);
			});
		});
	}

	/** Register Commands */
	registerCommands() {
		readdirSync(join(__dirname, '..', 'commands'))
		.forEach(item => {
			if (item.endsWith('.js')) {
				const command = new (require(join(__dirname, '..', 'commands', item)).default)(this);
				this.commands.set(command.name, command)
				if (command.aliases) command.aliases.forEach(alias => this.aliases.set(alias, command))
			} else {
				readdirSync(join(__dirname, '..', 'commands', item))
				.forEach(cmd => {
					const command = new (require(join(__dirname, '..', 'commands', item, cmd)).default)(this);
					this.commands.set(command.name, command)
					if (command.aliases) command.aliases.forEach(alias => this.aliases.set(alias, command))
				});
			}
		});
	}

	/** Functions */
	async reloadCommands() {
		const files = readdirSync(join(__dirname, '..', 'commands'));

		// clear the collection
		try { this.commands.clear(); try { this.aliases.clear(); } 
		catch { return new Error('Cannot clear aliases'); } } 
		catch { return new Error('Cannot clear commands'); }

		// then create a new collection
		this.commands = new Collection();
		this.aliases = new Collection();

		// push commands into items[]
		files.forEach(f => {
			if (!f.endsWith('.js')) { 
				readdirSync(join(__dirname, '..', 'commands', f)).forEach(i => {
				items.push(require(join(__dirname, '..', 'commands', f, i)).default);
			})} else {
				items.push(require(join(__dirname, '..', 'commands', f)).default);
			}
		})

		// then push it in our new collection
		items.forEach(command => {
			this.commands.set(command.name, command);
			command.aliases.forEach(a => this.aliases.set(a, command));
		})
		return { commands: this.commands, aliases: this.aliases };
	}

	async loadCommand(cmd) {
		const array = [];
		// check if {cmd} is already in {this.commands|this.aliases}
		if (this.commands.has(cmd) || this.aliases.has(cmd))
			return new Error('AlreadyLoaded');
		// find in files and push -> array[]
		readdirSync(join(__dirname, '..', 'commands'))
		.forEach(item => {
			if (item.endsWith('.js')) array.push(new (require(join(__dirname, '..', 'commands')).default)(this));
			else readdirSync(join(__dirname, '..', 'commands', item)).forEach(c => array.push(new (require(join(__dirname, '..', 'commands', item, c)).default)(this)))
		});
		// then find {cmd} in array[]
		const command = array.find(c => c.name === cmd);
		if (!command) return new Error('NothingFound');
		return command;
	}

	async unloadCommand(cmd) {
		const command = this.commands.get(cmd) || this.aliases.get(cmd);
		if (!command) return new Error('UnknownCommand');
		// remove from collection
		this.commands.delete(command.name);
		command.aliases.forEach(a => this.aliases.delete(a));
		return true;
	}

	/** Getters */
	get version() {
		return this.package.version;
	}
	get dependencies() {
		return Object.keys(this.package.dependencies);
	}
	get prefix () {
		return this.config.prefix;
	}
	get developers() {
		return this.config.developers;
	}
}

export default Musicord;