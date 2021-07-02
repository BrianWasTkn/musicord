import { Command, Context, GuildMemberPlus, Currency } from 'lava/index';
import { MessageEmbedOptions } from 'discord.js';

export default class extends Command {
	constructor() {
		super('balance', {
			aliases: ['balance', 'bal'],
			clientPermissions: ['EMBED_LINKS'],
			description: 'Check yours or someone elses balance.',
			name: 'Balance',
			args: [{
				id: 'member',
				type: 'member',
				default: (c: Context) => c.member,
				description: 'The user you who you wanna check the balance.',
			}]
		});
	}

	async exec(ctx: Context, args: { member: GuildMemberPlus }) {
		const entry = await ctx.currency.fetch(args.member.user.id);
		const { user } = args.member;

		// temporary coz testing owo
		if (entry.props.pocket <= 0) {
			await entry.addPocket(Currency.MAX_BET).save(false);
		}
		if (user.id === ctx.author.id && entry.props.pocket >= Currency.MAX_SAFE_POCKET) {
			await ctx.channel.send(`Hey! It looks like you have over **${Currency.MAX_SAFE_POCKET.toLocaleString()} coins** in your pocket, would you like to set me your pocket to that cap right now?`);
			const choice = await ctx.awaitMessage();
			if (!choice || !choice.content) {
				await ctx.reply('respond with yes or no bruh, try again.');
				return false;
			}
			if (choice.content.toLowerCase().slice(0, 1) === 'n') {
				await ctx.reply('ok then, dont expect any info about ur balance');
				return false;
			}

			await entry.removePocket(entry.props.pocket).addPocket(Currency.MAX_SAFE_POCKET).save();
		}

		return ctx.channel.send({
			embed: <MessageEmbedOptions>{
				title: `${user.username}'s balance`,
				color: ctx.client.util.randomColor(),
				description: Object.entries({
					'Wallet': entry.props.pocket.toLocaleString(),
					'Bank': `${entry.props.vault.amount.toLocaleString()}${user.id === ctx.author.id
							? `/${entry.props.space.toLocaleString()}`
							: ''
						}`,
					'Items': `${entry.items.filter(i => i.owned > 0).size.toLocaleString()}/${this.client.handlers.item.modules.size.toLocaleString()
						}`
				})
					.map(([label, val]) => `**${label}:** ${val}`)
					.join('\n')
			}
		}).then(() => false);
	}
}