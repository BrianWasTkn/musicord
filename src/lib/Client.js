import { Client, Collection } from 'discord.js'
import { readdirSync } from 'fs'

import { Player } from './Player.js'
import { Util } from './Util.js'
import { config } from '../config.js'

export class Musicord extends Client {
	constructor(config) {
		super({ disableMentions: 'everyone' });
		this.distube = new Player(this);
		this.config = config;
		this.utils = new Util(this);
		this.commands = new Collection();
		this.aliases = new Collection();
		this.cooldowns = new Collection();
		this.setup();
	}

	setup() {
		readdirSync(`${process.cwd()}/src/commands`).forEach(async cmd => {
			const command = (await import(`../commands/${cmd}`)).default;
			this.commands.set(command.props.name, command);
			command.props.aliases.forEach(a => this.aliases.set(a, command));
			this.utils.log(
				this.constructor.name, 
				'main', `Command "${command.props.name}" loaded.`
			);
		});

		readdirSync(`${process.cwd()}/src/emitters`).forEach(async em => {
			((await import(`../emitters/${em}`)).run.bind(this))();
			this.utils.log(
				this.constructor.name, 
				'main', `Listener "${em.split('.')[0]}" loaded.`
			);
		});
	}
}