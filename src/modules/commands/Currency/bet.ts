import { MessageOptions, Collection } from 'discord.js';
import { Context, ContextDatabase } from 'lib/extensions';
import { Argument } from 'discord-akairo';

import { default as Constants } from 'lib/utility/constants';
import { Embed, Effects } from 'lib/utility';
import { Command, Item } from 'lib/objects';
import config from 'config/index';

export default class Currency extends Command {
	constructor() {
		super('bet', {
			name: 'Gamble',
			aliases: ['gamble', 'roll', 'bet'],
			channel: 'guild',
			description: 'Play a dice game by rolling a d12 dice!',
			category: 'Currency',
			cooldown: 3000,
			args: [
				{
					id: 'amount',
					type: 'gambleAmount',
				},
			],
		});
	}

	async exec(
		ctx: Context<{ amount: number }>,
		userEntry: ContextDatabase
	): Promise<MessageOptions> {
		const {
			util,
			util: { effects },
			db: { currency: DB },
		} = ctx.client;

		// Core
		const { MAX_WIN, MIN_BET, MAX_BET, MAX_POCKET } = Constants.Currency;
		const data = userEntry.data;
		const multi = DB.utils.calcMulti(ctx, data).total;

		// Args
		const { amount: bet } = ctx.args;
		const args = ((bet: number) => {
			let state = false;
			switch (true) {
				case data.pocket <= 0:
					return { state, m: "You don't have coins to gamble!" };
				case data.pocket >= MAX_POCKET:
					return { state, m: `You're too rich (${MAX_POCKET.toLocaleString()}) to gamble!` };
				case bet > data.pocket:
					return { state, m: `You only have **${data.pocket}** coins don't lie to me hoe.` };
				case !bet:
					return { state, m: 'You need something to gamble!' };
				case bet < 1 || !Number.isInteger(Number(bet)):
					return { state, m: 'It has to be a real number greater than 0 yeah?' };
				case bet < MIN_BET:
					return { state, m: `You can't gamble lower than **${MIN_BET}** coins sorry` };
				case bet > MAX_BET:
					return { state, m: `You can't gamble higher than **${MAX_BET.toLocaleString()}** coins sorry` };
				default:
					return { state: true, m: null };
			}
		})(bet);
		if (!args.state) {
			return { content: args.m, replyTo: ctx.id };
		}

		// Item Effects
		const iDiceEffs: Item[] = [];
		let extraWngs: number = 0;
		let dceRoll: number = 0;
		for (const it of ['thicc', 'brian', 'dragon', 'trophy']) {
			const userEf = effects.get(ctx.author.id);
			if (!userEf) {
				const col = new Collection<string, Effects>().set(it, new Effects());
				effects.set(ctx.author.id, col);
			}
			if (effects.get(ctx.author.id).has(it)) {
				const { modules: mods } = ctx.client.handlers.item;
				if (['dragon'].includes(it)) iDiceEffs.push(mods.get(it));
				const i = effects.get(ctx.author.id).get(it);
				extraWngs += i.gambleWinnings;
				dceRoll += i.gambleDice;
			}
		}

		// Dice
		const rig = (a: number, b: number) => (a > b ? [b, a] : [a, b]);
		let userD = util.randomNumber(1, 12);
		let botD = util.randomNumber(1, 12);
		if (Math.random() > 0.55) {
			[userD, botD] = rig(botD, userD);
		} else {
			[botD, userD] = rig(userD, botD);
		}
		userD += dceRoll;

		// vis and db
		let perwn: number, description: string[], identifier: string, color: string;

		if (botD === userD || botD > userD) {
			const ties = botD === userD;
			const lost = ties ? Math.round(bet / 4) : bet;
			const { pocket } = await userEntry.addCd().removePocket(lost).updateItems()
				.calcSpace().updateStats('lost', lost).updateStats('loses').save();
			// if (!ties) ctx.client.handlers.quest.emit('gambleLose', { cmd: this, ctx });

			identifier = ties ? 'tie' : 'losing';
			color = ties ? 'YELLOW' : 'RED';
			description = [
				`You lost **${lost.toLocaleString()}**\n`,
				`You now have **${pocket.toLocaleString()}**`,
			];
		} else if (userD > botD) {
			let wngs = Math.ceil(bet * (Math.random() + (0.3 + extraWngs)));
			wngs = Math.min(MAX_WIN, wngs + Math.ceil(wngs * (multi / 100)));
			perwn = Math.round((wngs / bet) * 100);

			const { pocket } = await userEntry.addCd().addPocket(wngs).updateItems()
				.calcSpace().updateQuest({ cmd: this, count: 1 }).updateStats('won', wngs)
				.updateStats('wins').save();

			identifier = Boolean(extraWngs) ? 'powered' : 'winning';
			color = Boolean(extraWngs) ? 'BLUE' : 'GREEN';
			description = [
				`You won **${wngs.toLocaleString()}**\n`,
				`**Percent Won** \`${perwn}%\`${extraWngs ? ` — \`(${Math.round(perwn - (extraWngs * 100))}% original)\`` : ''
				}`,
				`You now have **${pocket.toLocaleString()}**`,
			];
		}

		return {
			embed: {
				color,
				description: description.join('\n'),
				author: {
					name: `${ctx.author.username}'s ${identifier} gambling game`,
					iconURL: ctx.author.displayAvatarURL({ dynamic: true }),
				},
				fields: [
					{
						name: ctx.author.username,
						value: `Rolled a \`${userD}\` ${iDiceEffs.length >= 1
								? iDiceEffs.map((i) => i.emoji).join(' ')
								: ''
							}`,
						inline: true,
					},
					{
						name: ctx.client.user.username,
						value: `Rolled a \`${botD}\``,
						inline: true,
					},
				],
			},
		};
	}
}
