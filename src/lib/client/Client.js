import { Client, Collection } from 'discord.js'
import { readdirSync } from 'fs'
import { join } from 'path'

import { DisTube } from './Music.js'

export class Musicord extends Client {
	constructor(config) {
		super(config.clientOptions);
		/** {Object} ConfigStructure the main config for this client */
		this.config = require('../../config/main.js').default;
		/* {DisTube} DisTube the music player we'll use for this client */
		this.distube = new DisTube(this, config.playerOptions);
		/* {Util} Util certain utilities */
		this.utils = require('../util/main.js').default;
		/* {Object} Crib memers crib objects/funcs */
		this.crib = config.crib;
		/* {Collection} Some collections so we could fetch */
		this.commands = new Collection();
		this.aliases = new Collection();
		this.cooldowns = new Collection();

		this._setup(config);
	}

	_setup(config) {
		
		/* {Function} Our discord, distube and collector listeners */
		readdirSync(join(__dirname, '..', 'processes')).forEach(async p => {
			const proc = require(join(__dirname, '..', 'processes', p));
			if (config.main.devMode) {
				proc.runDev.bind(this);
				this.utils.log('Musicord', 'main', `dev:Loaded: ${proc}`);
			} else {
				proc.run.bind(this);
				this.utils.log('Musicord', 'main', `Loaded: ${p}`);
			}
		});

		/* {Object} Command Our commands */
		readdirSync(join(__dirname, '..', '..', 'cmds')).forEach(dir => {
			readdirSync(join(__dirname, '..', '..', 'cmds', dir)).forEach(cmd => {
				const command = require(join(__dirname, '..', '..', 'cmds', dir, cmd)).default;
				this.utils.log('Musicord', 'main', `Loaded: ${command.name}`);
				this.commands.set(command.help.name, command);
				command.help.aliases.forEach(a => this.aliases.set(a, command.help.name));
			});
		})
	}

	get developers() {
		return this.config.developers(this).map(dev => dev.id);
	}

	get prefix() {
		return this.config.bot.prefix;
	}
}