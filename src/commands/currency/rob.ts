import { GuildMember, MessageOptions } from 'discord.js';
import { InventorySlot } from 'lib/interface/handlers/item';
import { Context } from 'lib/extensions/message';
import { UserPlus } from 'lib/extensions/user';
import { MemberPlus } from 'lib/extensions/member';
import { Command } from 'lib/handlers/command';
import { Item } from 'lib/handlers/item';

export default class Currency extends Command {
	constructor() {
	    super('steal', {
			aliases: ['steal', 'rob', 'ripoff'],
			channel: 'guild',
			description: "Rob someone from the currency!",
			category: 'Currency',
			cooldown: 6e4,
			args: [
				{
				  id: 'member',
				  type: 'member',
				},
			],
	    });
	}

	async exec(ctx: Context<{ member: MemberPlus }>): Promise<MessageOptions> {
		const { user } = ctx.args.member;
		if (!ctx.args.member) {
			return { content: `You need to rob someone!` };
		}
		if (user.id === ctx.author.id) {
			return { content: `Bro you need to rob someone, not yourself dumbo` };
		}

		const userEntry = await ctx.db.fetch(ctx.author.id);
		const vicEntry = await ctx.db.fetch(user.id, false),
		{ pocket: userCoins } = userEntry.data, 
		{ pocket: vicCoins } = vicEntry.data;
		let min = 5000;

		if (userCoins < min) {
			return { content: `You need ${min} coins to rob someone.` };
		}
		if (vicCoins < min) {
			return { content: `The victim doesn't have ${min} coins bruh.` };
		}

		let lock = vicEntry.data.items.find(i => i.id === 'lock');
		let odds = ctx.client.util.randomNumber(1, 100);
		if (lock.expire > Date.now()) {
			return { content: `You almost broke their padlock! Give one more try.` };
		}
		// Cleaned
		if (odds >= 90) {
			let worth = Math.round(vicCoins);
			await vicEntry.removePocket(worth).save();
			await userEntry.addPocket(worth).save();
			return { replyTo: ctx.id, content: `**You stole ALL :herb:**\nYou managed to steal **${worth.toLocaleString()}** coins LMAO` };
		}

		// 50% of Pocket
		if (odds >= 60) {
			let worth = Math.round(vicCoins * 0.5);
			await vicEntry.removePocket(worth).save();
			await userEntry.addPocket(worth).save();
			return { replyTo: ctx.id, content: `**You stole HALF :money_mouth:**\nYour payout was **${worth.toLocaleString()}** coins` };
		}

		// 30% of Pocket
		if (odds >= 30) {
			let worth = Math.round(vicCoins * 0.3);
			await vicEntry.removePocket(worth).save();
			await userEntry.addPocket(worth).save();
			return { replyTo: ctx.id, content: `**You stole a small portion :money_with_wings:**\nYour payout was **${worth.toLocaleString()}** coins` };
		}

		// Fail
		let punish: number;
		if ((userCoins * 0.05) < 500) punish = 500;
		else punish = userCoins * 0.05;

		await userEntry.removePocket(Math.round(punish)).save();
		await vicEntry.addPocket(Math.round(punish)).save();
		return { replyTo: ctx.id, content: `**You failed HAHAHAHAHA**\nYou got fined ${Math.round(punish).toLocaleString()} coins lmao` };
	}
}
