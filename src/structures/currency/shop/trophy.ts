export default {
	info: {
		name: 'Trophy',
		emoji: ':trophy:',
		description: 'Gives you a 10% steal shield, 25% multiplier and +1 to ALL gambling dice rolls.'
	},
	shop: {
		cost: 10e6,
		buyable: true,
		usable: false,
		sellable: true
	},
	fn: (): boolean => true
}