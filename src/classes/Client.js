import { Client, Collection } from 'discord.js'
import { join } from 'path'
import { readdirSync } from 'fs'
import { Player } from 'discord-music-player' // test

import { log } from '../utils/logger.js'
import DisTube from './Player.js'
import Utilities from './Utilities.js'
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