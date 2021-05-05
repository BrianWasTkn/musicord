import { GuildMember } from 'discord.js';
import { Spawn } from 'lib/objects';

const visual: Handlers.Spawn.Visual = {
	emoji: '<:memerBlue:729863510330310727>',
	type: 'GODLY',
	title: 'Amogus',
	description: 'Amogus',
	strings: ['amogus', 'red sus', 'sus'],
};

export default class Godly extends Spawn {
	constructor() {
		super('amogus', {
			visual, config: {
				rewards: { first: 10000, min: 250, max: 1000 },
				enabled: true,
				timeout: 15000,
				entries: 3,
				type: 'message',
				odds: 2,
			}
		});
	}

	cd = () => ({
		'693324853440282654': 3, // Booster
		'768858996659453963': 5, // Donator
		'794834783582421032': 10, // Mastery
		'693380605760634910': 20, // Amari
	});
}
