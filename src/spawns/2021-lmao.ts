import { SpawnConfig, SpawnVisuals } from 'discord-akairo'

export const config: SpawnConfig = {
	odds: 100,
	// odds: 21,
	cooldown: 21,
	enabled: true,
	timeout: 10000,
	entries: 1,
	rewards: {
		min: 210000,
		max: 210000
	} 
}

export const visuals: SpawnVisuals = {
	emoji: '<:memerBlue:729863510330310727>',
	type: 'COMMON',
	title: 'It\'s 2021',
	description: 'Happy New Years!',
	strings: [
		'bye 2020, hi 2021', 'heist when',
		'back to square twenty one', 'lol imagine still using skype in 2021', 
		'firecrackers', 'fire works with flame', 'a better start', '2021',
		'auld lang syne'
	]
}