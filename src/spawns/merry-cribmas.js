const { Collection } = require('discord.js');

exports.config = {
	// Odds
	odds: 3,
	// Collector
	time: 10000,
	max: Infinity,
	// Rewards
	rewards: {
		min: 5000, 
		max: 100000
	},
	// Visuals
	emoji: '<:memerGold:753138901169995797>',
	eventType: 'SPECIAL',
	title: 'Merry Cribmas',
	description: 'It\'s a special day for Memers Crib!',
	strings: [
		'merry chribmas', 'amonic', 'nice spam', 'brain',
		'damn son', 'ashol', 'atomic bomb', 'tangerine',
		'Lee oh.', 'finding dory', 'baddie claus', 'hi trend',
		'son of a crib'
	]
}