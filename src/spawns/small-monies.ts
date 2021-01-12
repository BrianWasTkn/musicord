import { SpawnConfig, SpawnVisuals } from 'discord-akairo'

export const config: SpawnConfig = {
	odds: 25,
	cooldown: 15,
	enabled: true,
	timeout: 5000,
	entries: 5,
	rewards: {
		min: 500000,
		max: 2500000
	} 
}

export const visuals: SpawnVisuals = {
	emoji: '<:memerBlue:729863510330310727>',
	type: 'COMMON',
	title: 'Financial Support',
	description: 'Do you need some money?',
	strings: [
		'yes', 'mhm', 'i do', 'yep', 'lol okay',
		'for heist pls', 'i ned money'
	]
}
