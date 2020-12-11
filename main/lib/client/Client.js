const { Client, Collection } = require('discord.js');
const { readdirSync } = require('fs');
const { join } = require('path');

const distube = require('distube');

module.exports = class Musicord extends Client {
	constructor(client, player) {
		super(client);
		this.config = require('../../config.js');
		this.crib = this.config.cribConfig;
		this.distube = new distube(this, player);
		this.cmds = new Collection();
		this.cooldowns = new Collection();
		this._setup();
	}

	_setup() {
		readdirSync(join(__dirname, '..', '..', 'cmds')).forEach(dir => {
			readdirSync(join(__dirname, '..', '..', 'cmds', dir)).forEach(cmd => {
				const command = require(join(__dirname, '..', '..', 'cmds', dir, cmd));
				this.cmds.set(command.name, command);
				command.aliases.forEach(alias => this.cmds.set(alias, command));
				console.log(`Loaded: ${command.name}`);
			})
		});

		readdirSync(join(__dirname, '..', 'processes')).forEach(async lis => {
			await require(join(__dirname, '..', 'processes', lis)).run(this);
			console.log(`Loaded: ${lis}`);
		})

	}
}