import { Client, Collection } from 'discord.js'
import { readdirSync } from 'fs'
import { join } from 'path'

import { DisTube } from './Music.js'
import { Util } from './Util.js'

export class Musicord extends Client {
	constructor(clientOpts, playerOpts, customOpts) {
		super(customOpts);
		this.config = require('../../config/main.js').default;
		this.distube = new DisTube(this, playerOpts);
		this.util = new Util();
		
		for (const collections of ['commands', 'aliases', 'cooldowns']) {
			this[collections] = new Collection();
		}
	}
}