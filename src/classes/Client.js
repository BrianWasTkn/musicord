import { Client, Collection } from 'discord.js'
import { join } from 'path'
import { readdirSync } from 'fs'
import { Player } from 'discord-music-player' // test
import distube from 'distube'

import { logInit, logError } from '../utils/logger.js'
import Utilities from './Utilities.js'
import config from '../config.js'
import botPackage from '../../package.json'

export default class Musicord extends Client {
	constructor(discordOpts, playerOpts) {
		super(discordOpts);
		this.package = botPackage;
		this.config = config;
		this.utils = new Utilities();
		this.player = new distube(this, playerOpts);
		this.test = new Player(this);
		this.commands = new Collection();
		this.aliases = new Collection();
		this.cooldowns = new Collection();
		this._loadAll();
	}

	/** Load Functions */
	_loadAll() {
		try {
			this._registerCommands();
			logInit('Musicord', 'Commands Registered')
			try {
				this._loadListeners(this);
				logInit('Musicord', 'Listeners loaded')
			} catch(error) {
				logError('Musicord', 'Cannot initiate player events', error)
			}
		} catch(error) {
			logError('Musicord', 'Cannot register commands', error.stack)
		}
	}

	/** Register Commands */
	_registerCommands() {
	readdirSync(join(__dirname, '..', 'commands'))
		.forEach(item => {
			// Item in the array is either a file.js or a folder
			const command = item.endsWith('.js') ? require(join(__dirname, '..', 'commands', item)).default : readdirSync(join(__dirname, '..', 'commands', item)).map(cmd => require(join(__dirname, '..', 'commands', item, cmd)).default)
			// Push to collection
			this.commands.set(command.name, command);
			if (command.aliases) command.aliases.forEach(alias => this.aliases.set(alias, command))
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