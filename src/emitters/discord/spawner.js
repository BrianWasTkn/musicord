const { Listener } = require('discord-akairo');
const { Collection } = require('discord.js');
const { readdirSync } = require('fs');
const { join } = require('path');

const Spawner = require('../../lib/Spawner.js');

/**
 * Discord Message event
 * @exports @class @extends Listener
*/
module.exports = class Lava extends Listener {
	constructor() {
		super('spawner', {
			emitter: 'client',
			event: 'message'
		});
	}

	async exec(message) {
		const spawns = readdirSync(join(process.cwd(), 'src', 'spawns'));
		const { config, visuals } = require(join(process.cwd(), 'src', 'spawns', this.client.util.random('arr', spawns)));
		
		const spawn = new Spawner(
			this.client, join(process.cwd(), 'src', 'spawns'), config, visuals
		);

		await spawn.exec(message);
	}
}