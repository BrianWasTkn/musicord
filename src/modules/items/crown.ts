import { Context } from 'lib/extensions';
import { MessageOptions } from 'discord.js';
import { Item } from 'lib/objects';

export default class Tool extends Item {
	constructor() {
		super('crown', {
			category: 'Tool',
			sellable: false,
			buyable: true,
			premium: true,
			usable: false,
			emoji: ':crown:',
			name: "Royal Crown",
			cost: 5000,
			tier: 3,
			checks: ['time'],
			info: {
				short: 'Wear this to enchant your robbing skills!',
				long: 'Has a 100% chance of breaking someone\'s padlock!',
			},
		});
	}
}
