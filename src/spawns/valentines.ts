import { SpawnConfig, SpawnVisuals } from 'discord-akairo'

export const config: SpawnConfig = {
	odds: 14,
	cooldown: (member) => {
		// "Crib Booster" role
		if (member.roles.cache.has('693324853440282654')) return 14;
		// "Donator #M+" roles (minimum)
		if (member.roles.cache.has('768858996659453963')) return 20;
		// "Mastery #" roles (minimum)
		if (member.roles.cache.has('794834783582421032')) return 25;
		// "Amari #" roles (minimum)
		if (member.roles.cache.has('693380605760634910')) return 30;
		// Else
		return 60;
	},
	enabled: true,
	timeout: 10000,
	entries: Infinity,
	rewards: {
		min: 140000,
		max: 140000
	} 
}

export const visuals: SpawnVisuals = {
	emoji: '<:memerRed:729863510716317776>',
	type: 'UNCOMMON',
	title: 'Happy Valentines',
	description: 'Dank of hearts, or Queen of hearts?',
	strings: [
		'yes', 'simps', 'honey', 'love',
		'relationshits', 'cupid', 'lovers'
	]
}