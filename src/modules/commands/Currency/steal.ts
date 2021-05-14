import { ContextDatabase, Context, UserPlus, MemberPlus } from 'lib/extensions';
import { GuildMember, MessageOptions } from 'discord.js';
import { Command, Item } from 'lib/objects';

export default class Currency extends Command {
	constructor() {
	    super('steal', {
	    	name: 'Steal',
			aliases: ['steal', 'rob', 'ripoff'],
			channel: 'guild',
			description: "Rob someone from the currency!",
			category: 'Currency',
			cooldown: 1e4,
			args: [
				{
				  id: 'member',
				  type: 'member',
				},
			],
	    });
	}

	async exec(ctx: Context<{ member: MemberPlus }>, userEntry: ContextDatabase): Promise<MessageOptions> {
		if (!ctx.args.member) {
			return { replyTo: ctx.id, content: `You need to rob someone!` };
		}
		const { user } = ctx.args.member;
		if (user.id === ctx.author.id) {
			return { replyTo: ctx.id, content: `Bro you need to rob someone, not yourself dumbo` };
		}
		if (user.bot) {
			return { replyTo: ctx.id, content: 'LOL imagine pestering bots, shut-' };
		}

		const vicEntry = await (new ContextDatabase(ctx)).fetch(user.id);
		const { pocket: userCoins } = userEntry.data;
		const { pocket: vicCoins } = vicEntry.data;
		const min = 5000;

		if (userCoins < min) {
			return { replyTo: ctx.id, content: `You need ${min} coins to rob someone.` };
		}
		if (vicCoins < min) {
			return { replyTo: ctx.id, content: `The victim doesn't have ${min} coins bruh.` };
		}

		const padMod = ctx.client.handlers.item.modules.get('lock');
		const hahayes = padMod.findInv(vicEntry.data.items);
		let odds = ctx.client.util.randomNumber(1, 100);
		if (hahayes.expire > Date.now()) {			
			if (odds >= 40) {
				await vicEntry.updateInv(padMod.id, { active: false, expire: 0 }).save();
				return { replyTo: ctx.id, content: `**${padMod.emoji} You broke their padlock!**\nGive one more attempt for a robbery!` };
			}

			return { replyTo: ctx.id, content: `${padMod.emoji} You almost broke their padlock! Give one more try.` };
		}

		// Cleaned
		if (odds >= 90) {
			let worth = Math.round(vicCoins * 0.99);
			await vicEntry.removePocket(worth).save();
			await userEntry.addCd().addPocket(worth).save();
			return { replyTo: ctx.id, content: `**You managed to steal ALL before leaving :money_mouth:**\nYour payout was **${worth.toLocaleString()}** coins LMAO` };
		}

		// 50% of Pocket
		if (odds >= 80) {
			let worth = Math.round(vicCoins * 0.49);
			await vicEntry.removePocket(worth).save();
			await userEntry.addCd().addPocket(worth).save();
			return { replyTo: ctx.id, content: `**You managed to steal ALMOST HALF before leaving :moneybag:**\nYour payout was **${worth.toLocaleString()}** coins` };
		}

		// 30% of Pocket
		if (odds >= 60) {
			let worth = Math.round(vicCoins * 0.29);
			await vicEntry.removePocket(worth).save();
			await userEntry.addCd().addPocket(worth).save();
			return { replyTo: ctx.id, content: `**You stole a small portion :money_with_wings:**\nYour payout was **${worth.toLocaleString()}** coins` };
		}

		// Fail
		const punish: number = (userCoins * 0.05) < (min / 10) ? (min / 10) : userCoins * 0.05;
		await userEntry.addCd().removePocket(Math.round(punish)).save();
		await vicEntry.addPocket(Math.round(punish)).save();
		return { replyTo: ctx.id, content: `**You failed the robbery HAHAHAHAHA**\nYou paid them **${Math.round(punish).toLocaleString()}** coins lmao` };
	}
}
