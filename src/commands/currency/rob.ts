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
			cooldown: 6e4 * 5,
			args: [
				{
				  id: 'member',
				  type: 'member',
				},
			],
	    });
	}

	async exec(ctx: Context<{ member: MemberPlus }>): Promise<MessageOptions> {
		if (!ctx.args.member) {
			return { replyTo: ctx.id, content: `You need to rob someone!` };
		}
		const { user } = ctx.args.member;
		if (user.id === ctx.author.id) {
			return { replyTo: ctx.id, content: `Bro you need to rob someone, not yourself dumbo` };
		}

		const userEntry = await ctx.db.fetch(ctx.author.id);
		const vicEntry = await ctx.db.fetch(user.id, false),
		{ pocket: userCoins } = userEntry.data, 
		{ pocket: vicCoins } = vicEntry.data;
		let min = 5000;

		if (userCoins < min) {
			return { replyTo: ctx.id, content: `You need ${min} coins to rob someone.` };
		}
		if (vicCoins < min) {
			return { replyTo: ctx.id, content: `The victim doesn't have ${min} coins bruh.` };
		}

		await userEntry.addCd().save();
		let lock = vicEntry.data.items.find(i => i.id === 'lock');
		let odds = ctx.client.util.randomNumber(1, 100);
		if (lock.expire > Date.now()) {
			if (odds >= 30) {
				const hahayes = vicEntry.data.items.find(i => i.id === 'lock');
				hahayes.expire = 0;
				hahayes.active = false;
				await vicEntry.data.save();
				return { replyTo: ctx.id, content: `**You broke their padlock!**\nGive one more attempt for a robbery!` };
			}
			
			return { replyTo: ctx.id, content: `You almost broke their padlock! Give one more try.` };
		}
		// Cleaned
		if (odds >= 90) {
			let worth = Math.round(vicCoins * 0.99);
			await vicEntry.removePocket(worth).save();
			await userEntry.addPocket(worth).save();
			return { replyTo: ctx.id, content: `**You managed to steal ALL before leaving :money_mouth:**\nYou managed to steal **${worth.toLocaleString()}** coins LMAO` };
		}

		// 50% of Pocket
		if (odds >= 80) {
			let worth = Math.round(vicCoins * 0.49);
			await vicEntry.removePocket(worth).save();
			await userEntry.addPocket(worth).save();
			return { replyTo: ctx.id, content: `**You managed to steal almost HALF of their money:moneybag:**\nYour payout was **${worth.toLocaleString()}** coins` };
		}

		// 30% of Pocket
		if (odds >= 60) {
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
		return { replyTo: ctx.id, content: `**You failed the robbery HAHAHAHAHA**\nYou paid them ${Math.round(punish).toLocaleString()} coins instead lmao` };
	}
}
