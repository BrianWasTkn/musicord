import { Client, Collection } from 'discord.js'
import { join } from 'path'
import { readdirSync } from 'fs'
import { Player } from 'discord-music-player' // test
import distube from 'distube'

import { logInit, logError } from '../utils/logger.js'
import Utils from './Utilities.js'
import emotes from '../utils/emotes.js'
import config from '../config.js'
import botPackage from '../../package.json'

export default class Musicord extends Client {
	constructor(discordOpts, playerOpts) {
		super(discordOpts);
		this.package = botPackage;
		this.emotes = emotes;
		this.config = config;
		this.utils = new Utilities();
		this.player = new distube(this, playerOpts);
		this.test = new Player(this);
		this.commands = new Collection();
		this.aliases = new Collection();
		this.cooldowns = new Collection();
		this._loadAll();
	}

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

	/** reserved */
	_loadEvents(bot) {
	readdirSync(join(__dirname, '..', 'events'))
		.map(evt => evt.split('.')[0])
		.forEach(evt => {
			bot.on(evt, async (...args) => {
				await require(join(__dirname, '..', 'events', evt)).run(bot, ...args);
			})
		})
	}

	_registerCommands() {
	readdirSync(join(__dirname, '..', 'commands'))
		.forEach(cmd => {
			const command = require(join(__dirname, '..', 'commands', cmd)).default
			this.commands.set(command.name, command);
			if (command.aliases) {
				command.aliases.forEach(alias => {
					this.aliases.set(alias, command)
				})
			}
		})
	}

	_loadListeners(bot) {
		readdirSync(join(__dirname, '..', 'listeners'))
		.forEach(async l => {
			await require(join(__dirname, '..', 'listeners', l)).run(bot);
		})
	}

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