import { Client, Collection } from 'discord.js'
import { Player } from 'discord-music-player' // test
import DisTube from './Player.js'
import Utilities from './Utilities.js'

import { join } from 'path'
import { readdirSync } from 'fs'
import { log } from '../utils/logger.js'
import config from '../config.js'
import botPackage from '../../package.json'

export default class Musicord extends Client {
	constructor(discordOpts, playerOpts) {
		super(discordOpts);
		this.package = botPackage;
		this.config = config;
		this.utils = new Utilities();
		this.player = new DisTube(this, playerOpts);
		this.test = new Player(this);
		this.commands = new Collection();
		this.aliases = new Collection();
		this.cooldowns = new Collection();
		this._loadAll();
	}

	/** Load Everythin' */
	_loadAll() {
		try {
			this._loadListeners(this);
			log('main', 'Listeners Loaded')
			try {
				this._registerCommands();
				log('main', 'Commands Loaded')
			} catch(error) {
				log('error', 'Cannot register commands', error.stack)
			}
		} catch(error) {
			log('error', 'Cannot load bot listeners', error)
		}
	}

	/** Register Commands */
	_registerCommands() {
	readdirSync(join(__dirname, '..', 'commands'))
	.forEach(item => {
		// Item is a javascipt file
		if (item.endsWith('.js')) {
			const command = require(join(__dirname, '..', 'commands', item)).default;
			this.commands.set(command.name, command)
			if (command.aliases) command.aliases.forEach(alias => this.aliases.set(alias, command))
		}
		// item belongs to a category
		if (!item.endsWith('.js')) {
			readdirSync(join(__dirname, '..', 'commands', item))
			.forEach(cmd => {
				const command = require(join(__dirname, '..', 'commands', item, cmd)).default
				this.commands.set(command.name, command)
				if (command.aliases) command.aliases.forEach(alias => this.aliases.set(alias, command))
			})
		}
	})
	}

	/** Listeners */
	_loadListeners(bot) {
		readdirSync(join(__dirname, '..', 'listeners'))
		.forEach(async l => {
			await require(join(__dirname, '..', 'listeners', l)).run(bot);
		})
	}

	/** 
	 * Reload Commands
	 * @returns {Promise<void>} null
	 */
	async reloadCommands() {
		const items = [],
		files = readdirSync(join(__dirname, '..', 'commands'));

		// clear the collection
		try { this.commands.clear() try { this.aliases.clear() } 
		catch { throw new Error('Cannot clear aliases') } } 
		catch { return new Error('Cannot clear commands') }

		// push commands -> items[]
		files.forEach(f => {
			if (!f.endsWith('.js')) readdirSync(join(__dirname, '..', 'commands', f)).forEach(i => {
				items.push(require(join(__dirname, '..', 'commands', f, i)).default);
			}) else {
				items.push(require(join(__dirname, '..', 'commands', f)).default);
			}
		})

		// then load commands and aliases
		items.map(c => c.name)
		.forEach(c => { try { this.loadCommand(c); } catch {} });
		return this.commands;
	}

	/** 
	 * Load Command
	 * @param {String} cmd - the cmd query to load
	 * @returns {Command} the command object
	 */
	async loadCommand(cmd) {
		const array = [];
		// check if {cmd} is already in {this.commands|this.aliases}
		if (this.commands.has(cmd) || this.aliases.has(cmd))
			return new Error('AlreadyLoaded');
		// find in files and push -> array[]
		readdirSync(join(__dirname, '..', 'commands'))
		.forEach(item => {
			if (item.endsWith('.js')) array.push(require(join(__dirname, '..', 'commands')).default);
			else readdirSync(join(__dirname, '..', 'commands', item)).forEach(c => array.push(require(join(__dirname, '..', 'commands', item, c)).default))
		});
		// then find {cmd} in array[]
		const command = array.find(c => c.name === cmd);
		if (!command) return new Error('NothingFound');
		return command;
	}

	/** 
	 * Unload Command
	 * @param {String} cmd - the cmd query to load
	 * @returns {Boolean} wip
	 */
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
}