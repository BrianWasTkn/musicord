import { Context, CurrencyEntry, Currency, UserPlus } from 'lava/index';
import { MessageOptions, EmbedFieldData } from 'discord.js';
import { Argument } from 'discord-akairo';
import { GambleCommand } from '../..';

export default class extends GambleCommand {
	constructor() {
		super('gamble', {
			aliases: ['gamble', 'bet', 'roll'],
			name: 'Gamble',
		});
	}

	async exec(ctx: Context, args: { amount: number | string }) {
		const entry = await ctx.currency.fetch(ctx.author.id);

		const bet = this.parseArgs(ctx, args, entry);
		if (!bet) return ctx.reply('You need to bet something!');
		if (typeof bet === 'string') return ctx.reply('Needs to be a whole number yeah?');
		
		const state = this.checkArgs(bet, entry);
		if (typeof state === 'string') return ctx.reply(state);

		const { userD, botD } = this.roll();
		if (botD > userD || botD === userD) {
			const { props } = await (botD === userD 
				? entry.calc().xp(true)
				: entry.removePocket(bet)
			).save();

			return ctx.channel.send({ embed: {
				author: { name: `${ctx.author.username}'s gambling game` },
				footer: { text: 'sucks to suck' }, color: userD === botD ? 'YELLOW' : 'RED', 
				fields: this.displayField(ctx.author, userD, botD), description: [
					`You lost ${botD === userD ? 'nothing!' : `**${bet.toLocaleString()}** coins.`}\n`,
					`You ${botD === userD ? 'still' : 'now'} have **${props.pocket.toLocaleString()}** coins.`
				].join('\n')
			}});
		}

		const multi = entry.calcMulti(ctx).reduce((p, c) => c.value + p, 0);
		const winnings = this.calcWinnings(multi, bet);
		const { props } = await entry.addPocket(winnings).save();

		return ctx.channel.send({ embed: {
			author: { name: `${ctx.author.username}'s gambling game` },
			footer: { text: 'winner winner' }, color: 'GREEN', description: [
				`You won **${winnings.toLocaleString()}** coins.`,
				`**Multiplier** ${multi.toLocaleString()}% | **Percent of bet won** ${Math.round(winnings / bet).toLocaleString()}%\n`,
				`You now have **${props.pocket.toLocaleString()}** coins.`
			].join('\n'), fields: this.displayField(ctx.author, userD, botD),
		}});
	}

	roll() {
		const { randomNumber } = this.client.util;
		let userD = randomNumber(1, 12);
		let botD = randomNumber(1, 12);

		/**
		 * Rig the dice because why not >:)
		 */
		function rig(a: number, b: number) {
			return a > b ? [b, a] : [a, b];
		}

		if (Math.random() > 0.6) {
			[botD, userD] = rig(botD, userD);
		} else {
			[userD, botD] = rig(botD, userD);
		}

		return { userD, botD };
	}

	displayField(user: UserPlus, userD: number, botD: number): EmbedFieldData[] {
		const fields = {
			[user.username]: `Rolled a \`${userD}\``,
			[user.client.user.username]: `Rolled a \`${botD}\``
		};

		return Object.entries(fields).map(([name, value]) => ({ inline: true, name, value }));
	}
}