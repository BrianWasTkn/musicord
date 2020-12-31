function inc(amount, multiplier) {
	return amount * Math.floor(Math.random() * multiplier);
}

module.exports = {
	// Odds
	chances: 25,
	rateLimit: 5,
	enabled: true,
	type: 'multiple',
	// Collector
	time: 10000,
	max: 5,
	// Rewards
	rewards: {
		min: 210000,
		max: 210000
	},
	// Visuals
	emoji: '<:memerGold:753138901169995797>',
	eventType: 'COMMON',
	title: '2021 When',
	description: 'End 2020 now',
	strings: [
		'bye 2020, hi 2021', 'heist when',
		'back to square twenty one', 'lol imagine still using skype in 2021', 
		'firecrackers', 'fire works with flame', 'a better start', '2021',
		'auld lang syne'
	]
}