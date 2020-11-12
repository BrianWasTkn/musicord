import { Client, Collection } from 'discord.js'
import { join } from 'path'
import { readdirSync } from 'fs'
import distube from 'distube'

import { logInit, logError } from '../utils/logger.js'
import * as utils from '../utils/utilities.js'
import * as emotes from '../utils/emotes.js'
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
		this.loadAll();
	}

	async loadAll() {
		try {
			this.loadEvents(this);
			await logInit('Init', 'Events Loaded')
		} catch(error) {
			await logError('Main', 'cannot load events', error)
		}

		try {
			this.registerCommands();
			await logInit('Init', 'Commands Registered')
		} catch(error) {
			await logError('Main', 'cannot register commands', error)
		}
	}

	async loadEvents(bot) {
	readdirSync(join(__dirname, '..', 'events'))
		.filter(evt => evt.endsWith('js'))
		.forEach(evt => {
			evt = require(join(__dirname, '..', 'events', evt))
			bot.on(evt, (...args) => {
				require(join(__dirname, '..', 'events', evt)).run(bot, ...args);
			})
		})
	}

	async registerCommands() {
	readdirSync(join(__dirname, '..', 'commands'))
		.filter(cmd => cmd.endsWith('js'))
		.forEach(cmd => {
			cmd = require(join(__dirname, '..', 'commands', cmd)).default
			this.commands.set(cmd.name, cmd);
			if (cmd.aliases) {
				cmd.aliases.forEach(alias => {
					this.aliases.set(alias, cmd)
				})
			}
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