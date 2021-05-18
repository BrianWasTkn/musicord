import { Context, UserPlus, MemberPlus, ContextDatabase } from 'lib/extensions';
import { GuildMember, MessageOptions } from 'discord.js';
import { Command, Item } from 'lib/objects';

export default class Currency extends Command {
	constructor() {
		super('craft', {
			name: 'Craft',
			aliases: ['craft', 'transform'],
			channel: 'guild',
			description: "Craft your coins into keys!",
			category: 'Currency',
			cooldown: 6e4,
		});
	}

	async exec(ctx: Context, userEntry: ContextDatabase): Promise<MessageOptions> {
		const reqs = { xp: 100, coins: 1e6 };
		const calcCoins = (m: number) => m / reqs.coins;
		const calcXP = (m: number) => m / reqs.xp;
		const { data } = userEntry;
		const { xp } = data.stats;

		if (data.pocket < reqs.coins) {
			return { reply: { messageReference: ctx.id, failIfNotExists: false }, content: `You don't have enough coins to craft!` };
		}

		await ctx.channel.send(`You have **:coin: ${data.pocket.toLocaleString()}** coins to craft **:key: ${Math.round(calcCoins(data.pocket)).toLocaleString()}** keys, how many keys do you wanna craft right now?`, { reply: { messageReference: ctx.id, failIfNotExists: false }, });
		const choice = (await ctx.awaitMessage()).first();
		if (!choice) {
			return { reply: { messageReference: ctx.id, failIfNotExists: false }, content: 'imagine wasting my time :rolling_eyes:' };
		}
		if (!Number.isInteger(Number(choice.content)) || Number(choice.content) <= 0) {
			return { reply: { messageReference: choice.id, failIfNotExists: false }, content: 'it has to be a real number greater than 0 yeah?' };
		}

		const nice = Number(choice.content);
		if ((nice * reqs.coins) > data.pocket) {
			return { reply: { messageReference: choice.id, failIfNotExists: false }, content: `you can't craft keys more than what you actually can, buddy` };
		}

		await userEntry.updateQuest({ cmd: this, count: nice }).addPremiumKeys(Math.round(nice)).removePocket(Math.round(nice * reqs.coins)).save();
		return { reply: { messageReference: ctx.id, failIfNotExists: false }, embed: { color: 'GOLD', description: `Successfully crafted **:coin: ${Math.round(nice * reqs.coins).toLocaleString()}** coins for **:key: ${Math.round(nice).toLocaleString()}** keys.` } };
	}
}
