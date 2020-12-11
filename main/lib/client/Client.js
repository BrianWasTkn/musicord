const { Client, Collection } = require('discord.js');
const { readdirSync } = require('fs');
const { join } = require('path');

const distube = require('distube');

module.exports = class Musicord extends Client {
	constructor(options) {
		super(options);
		this.config = require('../../config.js');
		this.crib = this.config.cribConfig;
		this.player = new Player(this);
		this.cmds = new Collection();
		this.cooldowns = new Collection();
		this._setup();
	}

	_setup() {
		this.cmds = [];
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

		super.login('Njg2OTY5MDIwMzg1MzI5MTgy.Xme7wQ.8NNvk2zlQ6I08eQcqDNRD7OxlZs');
	}
}