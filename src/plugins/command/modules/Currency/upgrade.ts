import { Command, Context, Item } from 'lava/index';

export default class extends Command {
	constructor() {
		super('upgrade', {
			aliases: ['upgrade', 'upg'],
			clientPermissions: ['EMBED_LINKS'],
			cooldown: 1000 * 60 * 1,
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
		await ctx.channel.send(`What item do u wanna upgrade?`);
		const choice = await ctx.awaitMessage();
		if (!choice || !choice.content) {
			await ctx.reply('ok no then weirdo');
			return false;
		}

		await ctx.reply('Sike, upgrade comin later ok?');
		return false;
	}
}