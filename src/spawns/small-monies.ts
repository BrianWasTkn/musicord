import { SpawnConfig, SpawnVisuals } from 'discord-akairo'

export const config: SpawnConfig = {
	odds: 25,
	cooldown: 15,
	enabled: true,
	timeout: 5000,
	entries: 1,
	rewards: {
		min: 500000,
		max: 2500000
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
