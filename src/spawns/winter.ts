import { SpawnConfig, SpawnVisuals } from 'discord-akairo'

export const config: SpawnConfig = {
	odds: 5,
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
	entries: 5,
	rewards: {
		min: 100000,
		max: 500000
	} 
}

export const visuals: SpawnVisuals = {
	emoji: '<:memerBlue:729863510330310727>',
	type: 'COMMON',
	title: 'Winter',
	description: 'Is it freezing outside?',
	strings: [
		'yes', 'snowman', 'cold asf', 'cold overload',
		'snowballs', 'it feels like christmas', 'winter'
	]
}