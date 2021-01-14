import { SpawnConfig, SpawnVisuals } from 'discord-akairo'

export const config: SpawnConfig = {
	odds: 5,
	cooldown: (member) => {
		// "Crib Booster" role
		if (member.roles.cache.has('693324853440282654')) return 5;
		// "Donator #M+" roles (minimum)
		if (member.roles.cache.has('768858996659453963')) return 7;
		// "Mastery #" roles (minimum)
		if (member.roles.cache.has('794834783582421032')) return 15;
		// "Amari #" roles (minimum)
		if (member.roles.cache.has('693380605760634910')) return 25;
		// Else
		return 60;
	},
	enabled: true,
	timeout: 10000,
	entries: 3,
	rewards: {
		min: 100000,
		max: 500000
	} 
}

export const visuals: SpawnVisuals = {
	emoji: '<:memerGreen:729863510296887398>',
	type: 'SUPER',
	title: 'Get Coinified',
	description: 'Do you want coins?',
	strings: [
		'yep', 'okay', 'yes i do!', 'lol sure',
		'give me now', 'gib or ban tomorrow', 
		'i guess so'
	]
}
