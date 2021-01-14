import { SpawnConfig, SpawnVisuals } from 'discord-akairo'

export const config: SpawnConfig = {
	odds: 20,
	cooldown: (member) => {
		// "Crib Booster" role
		if (member.roles.cache.has('693324853440282654')) return 3;
		// "Donator #M+" roles (minimum)
		if (member.roles.cache.has('768858996659453963')) return 5;
		// "Mastery #" roles (minimum)
		if (member.roles.cache.has('794834783582421032')) return 10;
		// "Amari #" roles (minimum)
		if (member.roles.cache.has('693380605760634910')) return 20;
		// Else
		return 60;
	},
	enabled: true,
	timeout: 10000,
	entries: 1,
	rewards: {
		min: 10000,
		max: 100000
	} 
}

export const visuals: SpawnVisuals = {
	emoji: '<:memerBlue:729863510330310727>',
	type: 'COMMON',
	title: 'Financial Support',
	description: 'Do you need it?',
	strings: [
		'im begging you', 'i wanna be a helicopter', 'sure lol why not',
		'for my wallet pls kthx bye', 'i wanna be a millionaire so fricking bad'
	]
}
