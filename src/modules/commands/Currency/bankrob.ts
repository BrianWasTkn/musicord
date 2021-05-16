import { Collection, Message, MessageOptions, CollectorFilter, MessageCollectorOptions } from 'discord.js';
import { MemberPlus, Context, ContextDatabase } from 'lib/extensions';
import { successMsgs, naniMsgs, failMsgs } from 'src/assets/arrays/bankrob.json';
import { Command } from 'lib/objects';

export default class Currency extends Command {
	constructor() {
	    super('bankrob', {
	    	name: 'Bankrob',
			aliases: ['bankrob', 'heist'],
			channel: 'guild',
			description: "Rob their banks!",
			category: 'Currency',
			cooldown: 3e4,
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
			return { reply: { messageReference: ctx.id, failIfNotExists: false }, content: `You need to heist someone!` };
		}
		const { user } = ctx.args.member;
		if (user.id === ctx.author.id) {
			return { reply: { messageReference: ctx.id, failIfNotExists: false }, content: `Bro you need to heist someone, not yourself dumbo` };
		}
		if (user.bot) {
			return { reply: { messageReference: ctx.id, failIfNotExists: false }, content: 'LOL imagine pestering bots, shut-' };
		}

		const vicEntry = await (new ContextDatabase(ctx)).fetch(user.id);
		const userCoins = userEntry.data.pocket;
		let vicCoins = vicEntry.data.vault;
		let min = 5000;

		if (userCoins < min) {
			return { reply: { messageReference: ctx.id, failIfNotExists: false }, content: `You need ${min} coins to rob someone.` };
		}
		if (vicCoins < min) {
			return { reply: { messageReference: ctx.id, failIfNotExists: false }, content: `The victim doesn't have ${min} coins in their vault bruh.` };
		}
		if (ctx.client.util.curHeist.has(ctx.guild.id)) {
			return { reply: { messageReference: ctx.id, failIfNotExists: false }, content: `There's a heist going on this server right now.` };
		}

		const padMod = ctx.client.handlers.item.modules.get('lock');
		const hahayes = padMod.findInv(vicEntry.data.items);
		let odds = ctx.client.util.randomNumber(1, 100);
		if (hahayes.expire > Date.now()) {			
			if (odds >= 40) {
				await vicEntry.updateInv(padMod.id, { active: false, expire: 0 }).save();
				return { reply: { messageReference: ctx.id, failIfNotExists: false }, content: `**${padMod.emoji} You broke their padlock!**\nGive one more attempt for a robbery!` };
			}

			return { reply: { messageReference: ctx.id, failIfNotExists: false }, content: `${padMod.emoji} You almost broke their padlock! Give one more try.` };
		}

		await userEntry.addCd().save(true);
		await vicEntry.beingHeisted(true).save();
		await ctx.send({ content: `**${ctx.author.username}** is starting a heist against **${user.username}**! Type \`JOIN HEIST\` to join in 60 seconds!` });
		ctx.client.util.curHeist.set(ctx.guild.id, true);
		const entries = new Collection<string, Context>([[ctx.author.id, ctx]]);
		const options: MessageCollectorOptions = { max: Infinity, time: 6e4 };
		const filter: CollectorFilter<[Context]> = m => m.content.toLowerCase() === 'join heist';
		const collector = ctx.channel.createMessageCollector(filter as (
			(m: Message) => boolean
		), options);

		const onCollect = async (m: Context) => {
			const remove = (id: string) => entries.delete(id);
			entries.set(m.id, m);
			if (entries.filter(e => e.author.id === m.author.id).size > 1) {
				remove(m.id); return m.reply('You already joined bruh');
			}
			if (m.author.id === user.id) {
				remove(m.id); return m.reply(`You ain't allowed to join because you're being heisted HAHAHAHA`);
			}

			const entry = await (new ContextDatabase(ctx)).fetch(m.author.id);
			if (entry.data.pocket < min) {
				remove(m.id); return m.reply(`You need ${min} coins to join LMAO`);
			}

			await entry.removePocket(min).save();
			return m.react('🏦');
		};

		const onEnd = async () => {
			const { randomNumber, randomInArray } = ctx.client.util;
			const [ripMsg, niceMsg, nullMsg]: string[][] = [failMsgs, successMsgs, naniMsgs];
			const odds = () => randomNumber(1, 100);
			// s - success; n - nothing; f - fail
			const [s, n, f]: MemberPlus[][] = Array(3).fill([]);
			vicEntry.beingHeisted(false);
			ctx.client.util.curHeist.delete(ctx.guild.id);
			if (entries.size <= 1) return ctx.reply('Well looks like you\'re alone.');
			if (entries.size <= 5) vicCoins /= 2;

			// end message
			await ctx.send({
				content: `\`${entries.size}\` people are teaming up against **${user.username}** for **${vicCoins.toLocaleString()}** coins...`
			});

			// fail
			if (odds() <= 10) {
				await Promise.all([...entries.values()].map(async c => {
					const data = await (new ContextDatabase(c)).fetch(c.author.id, false);
					return data.removePocket(min).save();
				}));

				await vicEntry.addPocket(min * entries.size).save();
				return ctx.send({ content: `**:skull: Everyone failed the heist!**\n**${entries.size}** people paid **${user.username}** \`${min}\` coins each for an unsuccessful robbery.` });
			}

			// Odds for each individual idiots who spammed join heist
			[...entries.values()].sort(() => Math.random() - 0.5).forEach(m => {
				const chance = odds();
				if (chance >= 60 && s.length <= 15) return s.push(m.member);
				return (chance > 10 ? n : f).push(m.member);
			});

			// update their pocket values
			const coins = Math.round(vicCoins / s.length);
			await Promise.all([
				...(s.map(async m => {
					const enthree = await (new ContextDatabase(ctx)).fetch(m.user.id, false);
					return enthree.addPocket(coins).save();
				})), 
				...(f.map(async m => {
					const enthree = await (new ContextDatabase(ctx)).fetch(m.user.id, false);
					return enthree.removePocket(enthree.data.pocket).save();
				}))
			]);

			function replace<A extends MemberPlus[], S extends string, P extends string>(
				arr: A, symb: S, placeholders: P[]
			): P[] {
				return arr.map(m => `${symb} ${randomInArray(placeholders)
					.replace(/{user}/g, m.user.username)
					.replace(/{got}/g, coins.toLocaleString())
				}`) as P[];
			}

			// message mapping
			const success = s.length >= 1 ? replace(s, '+', niceMsg) : [];
			const nothing = n.length >= 1 ? replace(n, '#', nullMsg) : [];
			const fail = f.length >= 1 ? replace(f, '-', ripMsg) : [];

			// final
			if (success.length >= 1) await vicEntry.withdraw(vicCoins).removePocket(vicCoins).save();
			let content = `**Good job everybody!** We got a total of \`${vicCoins.toLocaleString()}\` coins!`;
			content += `\n${'```diff'}\n${[...fail, ...nothing].sort(() => Math.random() - 0.5).join('\n')}\n${success.join('\n')}\n${'```'}`;
			return ctx.send({ content });
		};

		collector.on('collect', onCollect);
		collector.on('end', onEnd as (
			c: Collection<string, Message>, r?: string
		) => any);
	}
}
