import { Context, Currency } from 'lava/index';
import { GambleCommand } from '../..';

export default class extends GambleCommand {
	constructor() {
		super('slots', {
			aliases: ['slotmachine', 'slots'],
			description: 'Spin the slot machine to have a chance to win a jackpot!',
			name: 'Slots',
		});
	}

	get slots() {
		return {
			broken_heart: [1, 10],
			clown: [1, 10],
			eggplant: [1, 10],
			pizza: [2, 25],
			flushed: [2, 25],
			star2: [3, 50],
			kiss: [3, 50],
			four_leaf_clover: [4, 100],
			fire: [4, 100],
		}
	}

	getSlots(emojis: string[]) {
		const { randomInArray, randomNumber, deepFilter } = this.client.util;
		const first = randomInArray(emojis);
		const odds = randomNumber(1, 100);

		if (odds > 97) {
			return Array(3).fill(first);
		}
		if (odds > 80) {
			emojis = Array(3).fill(first);
			const index = randomNumber(1, emojis.length) - 1;
			const slots = Object.keys(this.slots);
			emojis[index] = randomInArray(slots.filter(e => e !== first));
			return emojis;
		}

		let second: string;
		const map = (_: string, index: number) => {
			if (index === 0) return second = randomInArray(deepFilter(emojis, [first]));
			return randomInArray(deepFilter(emojis, [first, second]));
		}

		return [first, ...Array(2).fill(first).map(map)];
	}

	async exec(ctx: Context, args: { amount: string | number }) {
		const entry = await ctx.currency.fetch(ctx.author.id);

		const bet = this.parseArgs(ctx, args, entry);
		if (typeof bet === 'string') return ctx.reply(bet).then(() => false);
		const state = this.checkArgs(bet, entry);
		if (typeof state === 'string') return ctx.reply(state).then(() => false);

		const multi = this.calcMulti(ctx, entry);
		const slots = this.getSlots(Object.keys(this.slots));
		const { winnings, length } = this.calcSlots(slots, bet, multi);

		if ([1, 2].every(l => l !== length)) {
			const { props } = await entry.removePocket(bet).save();
			return ctx.channel.send({
				embed: {
					color: 'RED',
					author: {
						name: `${ctx.author.username}'s slot machine`,
					},
					description: [
						`**>** :${slots.join(':    :')}: **<**\n`,
						`You lost **${bet.toLocaleString()}** coins.`,
						`You now have **${props.pocket.toLocaleString()}** coins.`
					].join('\n'),
					footer: {
						text: 'sucks to suck'
					}
				}
			}).then(() => true);
		}

		const { props } = await entry.addPocket(winnings).save();
		return ctx.channel.send({
			embed: {
				color: length === 1 ? 'GOLD' : 'GREEN',
				author: {
					name: `${ctx.author.username}'s slot machine`,
				},
				description: [
					`**>** :${slots.join(':    :')}: **<**\n`,
					`You won **${winnings.toLocaleString()}** coins.`,
					`**Multiplier** \`${Math.floor(winnings / bet)}x\``,
					`You now have **${props.pocket.toLocaleString()}** coins.`
				].join('\n'),
				footer: {
					text: 'winner winner'
				}
			}
		}).then(() => true);
	}

	calcSlots(slots: string[], bet: number, multis: number) {
		const rate = Object.values(this.slots);
		const emojis = Object.keys(this.slots);

		const length = slots.filter((e, i, arr) => arr.indexOf(e) === i).length;
		const rates = rate.map((_, i, arr) => arr[emojis.indexOf(slots[i])]).filter(Boolean);
		const multi = rates.filter((r, i, arr) => arr.indexOf(r) !== i)[0];

		if ([1, 2].some(l => length === l)) {
			const index = length === 1 ? 1 : 0;
			const mult = multi[index] as number;
			const winnings = bet * mult;
			// let winnings = Math.round(bet + (bet * mult));
			// winnings = winnings + Math.round(winnings * (multis / 10000));
			// winnings = Math.min(Currency.MAX_WIN, winnings + Math.ceil(winnings * (multis / 100)));

			return { length, winnings };
		}

		return { length, winnings: 0 };
	}
}