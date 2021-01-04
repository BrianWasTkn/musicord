import { SpawnConfig, SpawnVisuals } from 'discord-akairo'

export const config: SpawnConfig = {
	odds: 5,
	cooldown: 15,
	enabled: true,
	timeout: 3000,
	entries: 5,
	rewards: {
		min: 1000,
		max: 1000
	} 
}

export const visuals: SpawnVisuals = {
	emoji: '<:memerBlue:729863510330310727>',
	type: 'COMMON',
	title: 'Heist Money',
	description: 'Do you need some money to enter a heist?',
	strings: [
		'yes', 'mhm', 'i do', 'yep', 'lol okay',
		'for heist pls', 'i ned money'
	]
}