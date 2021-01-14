import { SpawnConfig, SpawnVisuals } from 'discord-akairo'

export const config: SpawnConfig = {
	odds: 100,
	// odds: 5,
	cooldown: 30,
	enabled: true,
	timeout: 10000,
	entries: 3,
	rewards: {
		min: 250000,
		max: 750000
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
