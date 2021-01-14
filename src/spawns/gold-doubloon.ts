import { SpawnConfig, SpawnVisuals } from 'discord-akairo'

export const config: SpawnConfig = {
	// odds: 25,
	odds: 100,
	cooldown: 15,
	enabled: true,
	timeout: 7500,
	entries: 1,
	rewards: {
		min: 1000000,
		max: 1000000
	} 
}

export const visuals: SpawnVisuals = {
	emoji: '<:memerGold:753138901169995797>',
	type: 'GODLY',
	title: 'Gold Doubloon',
	description: 'wow a very rare event themks',
	strings: [
		'gold', 'dis serber op', 'gg', 'what\'s the prize?',
		'how much tho', 'you got to be kidding me', 
		'peter piper picked a pack of pickle peper',
		'a pack of pickle peper peter piper picked',
		'spill the beans of the jelly beans'
	]
}
