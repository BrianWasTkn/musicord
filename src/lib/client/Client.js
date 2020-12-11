import { Client, Collection } from 'discord.js'
import { readdirSync } from 'fs'
import { join } from 'path'

import { DisTube } from './Music.js'

export class Musicord extends Client {
	constructor(config) {
		super(config.clientOptions);
		this._setup(config);
	}

	async _setup(config) {
		/** {Object} ConfigStructure the main config for this client */
		this.config = require('../../config/main.js').default;
		/* {DisTube} DisTube the music player we'll use for this client */
		this.distube = new DisTube(this, config.playerOptions);
		/* {Util} Util certain utilities */
		this.utils = require('../util/main.js').default;
		/* {Object} Crib memers crib objects/funcs */
		this.crib = config.crib;
		/* {Collection} Some collections so we could fetch */
		for (const collections of ['commands', 'aliases', 'cooldowns', 'processes']) {
			this[collections] = new Collection();
		}
		/* {Function} Our discord, distube and collector listeners */
		for (let p of readdirSync('../processes')) {
			if (config.main.devMode) await require(`../processes/${p}`).runDev.bind(this);
			else require(`../processes/${p}`).run.bind(this);
		}
		/* {Object} Command Our commands */
		for (const dir of readdirSync('../cmds')) {
			readdirSync(`../cmds/${dir}`).forEach(cmd => {
				const command = require(`../cmds/${subdir}/${cmd}`)();
				this.commands.set(command.name, command);
				command.aliases.forEach(a => this.aliases.set(a, command.name));
			});
		}
	}

	get developers() {
		return this.config.developers(this).map(dev => dev.id);
	}

	get prefix() {
		return this.config.bot.prefix;
	}
}