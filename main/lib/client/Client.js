const { Client } = require('discord.js');
const { readdirSync } = require('fs');
const { join } = require('join');

module.exports = class Musicord extends Client {
	constructor(options) {
		super(options);
		this._setup();
	}

	_setup() {
		this.cmds = [];
		readdirSync(join(__dirname, '..', '..', 'cmds')).forEach(dir => {
			readdirSync(join(__dirname, '..', '..', 'cmds', dir)).forEach(cmd => {
				const command = require(join(__dirname, '..', '..', 'cmds', dir, cmd));
				this.cmds.push(command);
				console.log(`Loaded: ${command.name}`);
			})
		});

		readdirSync(join(__dirname, '..', 'listeners')).forEach(async lis => {
			await require(join(__dirname, '..', 'listeners', lis)).run(this);
			console.log(`Loaded: ${lis}`);
		})
	}
}