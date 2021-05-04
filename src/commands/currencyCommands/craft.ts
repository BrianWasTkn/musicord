import { GuildMember, MessageOptions } from 'discord.js';
import { Context, UserPlus, MemberPlus } from 'lib/extensions';
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

	async exec(ctx: Context): Promise<MessageOptions> {
		const reqs = { xp: 1000, coins: 100e6 };
		const calcCoins = (m: number) => m / reqs.coins;
		const calcXP = (m: number) => m / reqs.xp;
		const userEntry = await ctx.db.fetch();
		const { data } = userEntry;
		const { xp } = data.stats;

		if (data.pocket < reqs.coins) {
			return { replyTo: ctx.id, content: `You don't have enough coins to craft!` };
		}

		await ctx.channel.send(`You have **:coin: ${data.pocket.toLocaleString()}** coins to craft **:key: ${Math.round(calcCoins(data.pocket)).toLocaleString()}** keys, how many keys do you wanna craft right now?`, { replyTo: ctx.id });
		const choice = (await ctx.awaitMessage()).first();
		if (!choice) {
			return { replyTo: ctx.id, content: 'imagine wasting my time :rolling_eyes:' };
		}
		if (!Number.isInteger(Number(choice.content)) || Number(choice.content) <= 0) {
			return { replyTo: choice.id, content: 'it has to be a real number greater than 0 yeah?' };
		}

		const nice = Number(choice.content);
		if ((nice * reqs.coins) > data.pocket) {
			return { replyTo: choice.id, content: `you can't craft keys more than what you actually can, buddy` };
		}

		await userEntry.updateQuest({ cmd: this, count: nice }).addPremiumKeys(Math.round(nice)).removePocket(Math.round(nice * reqs.coins)).save();
		return { replyTo: ctx.id, embed: { color: 'GOLD', description: `Successfully crafted **:coin: ${Math.round(nice * reqs.coins).toLocaleString()}** coins for **:key: ${Math.round(nice).toLocaleString()}** keys.` } };
	}
}
