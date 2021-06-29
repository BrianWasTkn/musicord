import { Context, UserPlus } from 'lava/index';
import { EmbedFieldData } from 'discord.js';
import { GambleCommand } from '../..';

export default class extends GambleCommand {
	constructor() {
		super('gamble', {
			aliases: ['gamble', 'bet', 'roll'],
			description: 'Take your chances by rolling a dice! Warning, I\'m very good at stealing your coins.',
			name: 'Gamble',
		});
	}

	async exec(ctx: Context, args: { amount: number | string }) {
		const entry = await ctx.currency.fetch(ctx.author.id);

		const bet = this.parseArgs(ctx, args, entry);
		if (typeof bet === 'string') return ctx.reply(bet);
		const state = this.checkArgs(bet, entry);
		if (typeof state === 'string') return ctx.reply(state);

		const { userD, botD } = this.roll(false);
		if (botD > userD || botD === userD) {
			const { props } = await entry.removePocket(botD === userD ? 0 : bet).save()

			return ctx.channel.send({
				embed: {
					author: {
						name: `${ctx.author.username}'s gambling game`
					},
					color: userD === botD ? 'YELLOW' : 'RED',
					description: [
						`You lost ${botD === userD ? 'nothing!' : `**${bet.toLocaleString()}** coins.`}\n`,
						`You ${botD === userD ? 'still' : 'now'} have **${props.pocket.toLocaleString()}** coins.`
					].join('\n'),
					fields: this.displayField(ctx.author, userD, botD),
					footer: {
						text: 'sucks to suck'
					},
				}
			});
		}

		const multi = this.calcMulti(ctx, entry);
		const winnings = this.calcWinnings(multi, bet);
		const { props } = await entry.addPocket(winnings).save();

		return ctx.channel.send({
			embed: {
				author: { name: `${ctx.author.username}'s gambling game` },
				footer: { text: 'winner winner' }, color: 'GREEN', description: [
					`You won **${winnings.toLocaleString()}** coins.`,
					`**Multiplier** ${multi.toLocaleString()}% | **Percent of bet won** ${Math.round(winnings / bet * 100)}%\n`,
					`You now have **${props.pocket.toLocaleString()}** coins.`
				].join('\n'), fields: this.displayField(ctx.author, userD, botD),
			}
		});
	}

	roll(rig = true, add = 0) {
		const { randomNumber } = this.client.util;
		let userD = randomNumber(1, 12);
		let botD = randomNumber(1, 12);

		/**
		 * Rig the dice because why not >:)
		 */
		function set(a: number, b: number) {
			return a > b ? [b, a] : [a, b];
		}

		if (rig) {
			if (Math.random() > 0.55) {
				[botD, userD] = set(botD, userD);
			} else {
				[userD, botD] = set(botD, userD);
			}
		}

		return { botD, userD: userD + add };
	}

	displayField(user: UserPlus, userD: number, botD: number): EmbedFieldData[] {
		const fields = {
			[user.username]: `Rolled a \`${userD}\``,
			[user.client.user.username]: `Rolled a \`${botD}\``
		};

		return Object.entries(fields).map(([name, value]) => ({ inline: true, name, value }));
	}
}