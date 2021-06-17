import { Command, Context, Item } from 'lava/index';

export default class extends Command {
	constructor() {
		super('sell', {
			aliases: ['sell'],
			clientPermissions: ['EMBED_LINKS'],
			description: 'Sel something to the shop!',
			name: 'Sell',
			args: [
				{
					id: 'item',
					type: 'item',
					default: null,
				},
				{
					id: 'amount',
					type: 'number',
					default: 1
				}
			]
		});
	}

	async exec(ctx: Context, args: { item: Item, amount: number }) {
		const entry = await ctx.currency.fetch(ctx.author.id);
		return ctx.channel.send('Coming soon:tm:');
	}
}