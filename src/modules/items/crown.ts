import { Context } from 'lib/extensions';
import { MessageOptions } from 'discord.js';
import { Item } from 'lib/objects';

export default class Tool extends Item {
	constructor() {
		super('crown', {
			category: 'Tool',
			sellable: false,
			buyable: true,
			premium: false,
			usable: false,
			emoji: ':crown:',
			name: "Crown",
			cost: 20000000,
			tier: 3,
			info: {
				short: 'Gives you a bit of protection against pesky robbers!',
				long: 'Gives you 10% steal shields against robbers.',
			},
		});
	}
}
