import { SpawnConfig, SpawnVisuals } from 'discord-akairo'

export const config: SpawnConfig = {
	odds: 3,
	cooldown: (member) => {
		// "Crib Booster" role
		if (member.roles.cache.has('693324853440282654')) return 10;
		// "Donator #M+" roles (minimum)
		if (member.roles.cache.has('768858996659453963')) return 15;
		// "Mastery #" roles (minimum)
		if (member.roles.cache.has('794834783582421032')) return 20;
		// "Amari #" roles (minimum)
		if (member.roles.cache.has('693380605760634910')) return 30;
		// Else
		return 60;
	},
	enabled: true,
	timeout: 10000,
	entries: 3,
	rewards: {
		min: 10000,
		max: 50000
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
