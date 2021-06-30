import { Command, Context, Currency } from 'lava/index';

export default class extends Command {
	constructor() {
		super('multipliers', {
			aliases: ['multipliers', 'multi'],
			clientPermissions: ['EMBED_LINKS'],
			description: 'View your secret multipliers for gambling.',
			name: 'Multiplier',
			args: [
				{
					id: 'page',
					type: 'number',
					default: 1
				}
			]
		});
	}

	async exec(ctx: Context, { page }: { page: number }) {
		const multis = await ctx.currency.fetch(ctx.author.id).then(d => d.calcMulti(ctx));
		const pages = ctx.client.util.paginateArray(
			multis.map(({ name, value }) => `${name} (\`+${value}%\`)`
		));

		if (!pages[page]) {
			return ctx.reply(`Page \`${page}\` doesn't exist.`);
		}

		return ctx.channel.send({ embed: {
			author: { name: `${ctx.author.username}'s Multipliers` },
			footer: { text: `Page ${page} of ${pages.length}` },
			color: 'BLURPLE', fields: [{
				name: `Total Multi: ${multis.reduce((p, c) => p + c.value, 0)}% (max of ${Currency.MAX_MULTI}%)`,
				value: pages[page - 1].join('\n')
			}],
		}})
	}
}