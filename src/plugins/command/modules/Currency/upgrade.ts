import { Command, Context, Item } from 'lava/index';

export default class extends Command {
	constructor() {
		super('upgrade', {
			aliases: ['upgrade', 'upg'],
			clientPermissions: ['EMBED_LINKS'],
			description: 'Upgrade an item!',
			name: 'Upgrade',
			args: [
				{
					id: 'item',
					type: 'item',
				}
			]
		});
	}

	async exec(ctx: Context, { item }: { item: Item }) {
		
	}
}