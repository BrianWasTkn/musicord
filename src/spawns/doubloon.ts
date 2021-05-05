import { GuildMember } from 'discord.js';
import { Spawn } from 'lib/objects';

const visual: Handlers.Spawn.Visual = {
	emoji: '<:memerGold:753138901169995797>',
	type: 'GODLY',
	title: 'Gold Doubloon',
	description: 'Ah sh*t here we go again',
	strings: ['bomb it', 'gold doubloon', 'queen lava', 'pjsalt', 'siopiao'],
};

export default class Godly extends Spawn {
	constructor() {
		super('doubloon', {
			visual, config: {
				rewards: { first: 10000, min: 100, max: 750 },
				enabled: true,
				timeout: 15000,
				entries: 3,
				type: 'message',
				odds: 2,
			}
		});
	}

	cd = () => ({
		'693324853440282654': 10, // Booster
		'768858996659453963': 15, // Donator
		'794834783582421032': 20, // Mastery
		'693380605760634910': 30, // Amari
	});
}
