import { GuildMember } from 'discord.js';
import { Spawn } from 'lib/objects';

const visual: Handlers.Spawn.Visual = {
	emoji: '<:memerRed:729863510716317776>',
	type: 'SUPER',
	title: 'Memers Crib',
	description: 'POV: You are sitting in your chair.',
	strings: ['WTF', 'what-', 'LOL', 'xd'],
};

export default class Crib extends Spawn {
	constructor() {
		super('crib', {
			visual, config: {
			rewards: { first: 1e5, min: 100, max: 1000 },
			enabled: true,
			timeout: 5000,
			entries: 3,
			type: 'message',
			odds: 5,
			}
		});
	}

	cd = () => ({
		'693324853440282654': 1, // Booster
		'768858996659453963': 3, // Donator
		'794834783582421032': 10, // Mastery
		'693380605760634910': 15, // Amari
	});
}
