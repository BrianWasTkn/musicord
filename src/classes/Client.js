import { Client, Collection } from 'discord.js'
import { join } from 'path'
import { readdirSync } from 'fs'
import distube from 'distube'

import { logInit, logError } from '../utils/logger.js'
import utils from '../utils/utilities.js'
import emotes from '../utils/emotes.js'
import config from '../config.js'
import botPackage from '../../package.json'

export default class Musicord extends Client {
	constructor(discordOpts, playerOpts) {
		super(discordOpts);
		this.package = botPackage;
		this.emotes = emotes;
		this.config = config;
		this.utils = utils;
		this.player = new distube(this, playerOpts);
		this.commands = new Collection();
		this.aliases = new Collection();
		this.cooldowns = new Collection();
		this._loadAll();
	}

	_loadAll() {
		try {
			this._loadEvents(this);
			logInit('Init', 'Events Loaded');
			try {
				this._registerCommands();
				logInit('Init', 'Commands Registered')
				try {
					this._listenPlayerEvents(this);
					logInit('Init', 'Player listener initiated')
				} catch(error) {
					logError('Init', 'cannot initiate player events', error)
				}
			} catch(error) {
				logError('Init', 'cannot register commands', error)
			}
		} catch(error) {
			logError('Init', 'cannot load events', error)
		}
	}

	_loadEvents(bot) {
	readdirSync(join(__dirname, '..', 'events'))
		.map(evt => evt.split('.')[0])
		.forEach(evt => {
			bot.on(evt, (...args) => {
				require(join(__dirname, '..', 'events', evt)).run(bot, ...args);
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

	_listenPlayerEvents(bot) {
		readdirSync(join(__dirname, '..', 'listeners'))
		.forEach(l => {
			const listener = require(join(__dirname, '..', 'listeners', l))
			listener.run(bot);
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