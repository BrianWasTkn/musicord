import { Command, Context } from 'lava/index';

export default class extends Command {
	constructor() {
		super('reset', {
			aliases: ['reset'],
			clientPermissions: ['EMBED_LINKS'],
			cooldown: 1000 * 60 * 60,
			description: 'Reset your currency data.',
			name: 'Reset'
		});
	}

	async exec(ctx: Context) {
		const { data } = await ctx.currency.fetch(ctx.author.id);

		await ctx.reply({ embed: { color: 'RED', description: 'Are u sure you wanna reset rn?' } });
		const prompt1 = await ctx.awaitMessage();
		if (!prompt1 || !prompt1.content) {
			return ctx.reply('Imagine not replying to me with a yes or no.');
		}
		if (!['yes', 'y', 'ye'].includes(prompt1.content)) {
			return prompt1.reply({ embed: { color: 'INDIGO', description: 'Okay then.' } });
		}

		await data.delete();
		return ctx.reply({ embed: { color: 'GREEN', description: 'Ok ur data has been deleted, enjoy the new life kid' } });
	}
}