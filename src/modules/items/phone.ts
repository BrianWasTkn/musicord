import { MessageOptions } from 'discord.js';
import { Context } from 'lib/extensions';
import { Item } from 'lib/objects';

export default class Tool extends Item {
	constructor() {
		super('phone', {
			category: 'Tool',
			sellable: true,
			buyable: true,
			usable: true,
			emoji: ':mobile_phone:',
			name: "Cellphone",
			cost: 69420,
			tier: 1,
			info: {
				short: 'Call the cops!',
				long:"Report an ongoing bankrobbery.",
			},
		});
	}

	use(ctx: Context): MessageOptions {
		ctx.client.util.currencyHeists.get(ctx.guild.id).stop('caught');
		return { reply: { messageReference: ctx.id, failIfNotExists: false }, content: `Nice.` };
	}
}
