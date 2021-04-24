import { GuildMember, Collection, MessageOptions, CollectorFilter, MessageCollectorOptions } from 'discord.js';
import { InventorySlot } from 'lib/interface/handlers/item';
import { Context } from 'lib/extensions/message';
import { UserPlus } from 'lib/extensions/user';
import { MemberPlus } from 'lib/extensions/member';
import { Command } from 'lib/handlers/command';
import { Item } from 'lib/handlers/item';

export default class Currency extends Command {
	constructor() {
	    super('bankrob', {
			aliases: ['bankrob', 'heist'],
			channel: 'guild',
			description: "Rob their banks!",
			category: 'Currency',
			cooldown: 6e4 * 10,
			manualCooldown: true,
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
			return { replyTo: ctx.id, content: `You need to heist someone!` };
		}
		const { user } = ctx.args.member;
		if (user.id === ctx.author.id) {
			return { replyTo: ctx.id, content: `Bro you need to heist someone, not yourself dumbo` };
		}

		const userEntry = await ctx.db.fetch(ctx.author.id);
		const vicEntry = await ctx.db.fetch(user.id, false);
		const { vault: userCoins } = userEntry.data;
		let { vault: vicCoins } = vicEntry.data;
		let min = 5000;

		if (userCoins < min) {
			return { replyTo: ctx.id, content: `You need ${min} coins to rob someone.` };
		}
		if (vicCoins < min) {
			return { replyTo: ctx.id, content: `The victim doesn't have ${min} coins in their vault bruh.` };
		}
		if (ctx.client.util.curHeist.has(ctx.guild.id)) {
			return { replyTo: ctx.id, content: `There's a heist going on this server right now.` };
		}

		let lock = vicEntry.data.items.find(i => i.id === 'lock');
		let odds = ctx.client.util.randomNumber(1, 100);
		if (lock.expire > Date.now()) {
			if (odds >= 60) {
				const hahayes = vicEntry.data.items.find(i => i.id === 'lock');
				hahayes.expire = 0;
				hahayes.active = false;
				await vicEntry.data.save();
				return { replyTo: ctx.id, content: `**You broke their padlock!**\nGive one more attempt for a robbery!` };
			}
			
			return { replyTo: ctx.id, content: `You almost broke their padlock! Give one more try.` };
		}

		await userEntry.addCd().save();
		await vicEntry.beingHeisted(true).save();
		await ctx.send({ content: `${ctx.author.username} is starting a heist against ${user.username}! Type \`JOIN HEIST\` to join!` });
		ctx.client.util.curHeist.set(ctx.guild.id, true);
		const entries = new Collection<string, Context>([[ctx.author.id, ctx]]);
		const options: MessageCollectorOptions = { max: Infinity, time: 6e4 };
		const filter: CollectorFilter<[Context]> = m => m.content.toLowerCase() === 'join heist';
		const collector = ctx.channel.createMessageCollector(filter, options);
		const finish = async () => {
			await vicEntry.beingHeisted(false).save();
			return ctx.client.util.curHeist.delete(ctx.guild.id);
		};

		const onCollect = async (m: Context) => {
			const entry = await ctx.db.fetch(m.author.id, false);
			const remove = (id: string) => entries.delete(id);
			entries.set(m.id, m);

			if (entries.filter(e => e.author.id === m.author.id).size > 1) {
				remove(m.id); return m.send({ replyTo: m.id, content: 'You already joined bruh' });
			}
			if (m.author.id === user.id) {
				remove(m.id); return m.send({ replyTo: m.id, content: `No because you're being heisted HAHAHAHA` });
			}
			if (entry.data.pocket < min) {
				remove(m.id); return m.send({ replyTo: m.id,  content: `You need ${min} coins to join LMAO` });
			}

			await entry.removePocket(min).save();
			return m.react('🏦');
		};
		const onEnd = async (col: Collection<string, Context>) => {
			const ripMsg = '{user} died and lost all their coins';
			const niceMsg = '{user} got {got} coins EPIC';
			const nullMsg = '{user} got nothing RIP';
			const odds = () => ctx.client.util.randomNumber(1, 100);
			// s - success; n - nothing; f - fail
			let s: MemberPlus[] = [], n: MemberPlus[] = [], f: MemberPlus[] = [];
			let promises: Promise<CurrencyProfile>[] = [];
			if (entries.size <= 2) {
				await finish();
				return ctx.reply('Well looks like you\'re alone.');
			}

			// Limit to half if less than 10
			if (entries.size <= 5) {
				vicCoins /= 2;
			}

			// fail
			if (odds() <= 10) {
				await Promise.all([...entries.values()].map(async c => {
					const data = await ctx.db.fetch(c.author.id, false);
					return data.removePocket(min).save();
				}));

				await finish();
				return ctx.send({ content: `Everyone failed! ${entries.size} people paid ${user.username} ${min} coins each for an unsuccessful robbery.` });
			}

			// end message
			await ctx.send({
				content: `\`${entries.size}\` people are teaming up against **${user.username}** for **${vicCoins.toLocaleString()}** coins...`
			});

			// Odds for each individual idiots who spammed join heist
			[...entries.values()].sort(() => Math.random() - 0.5).forEach(m => {
				const chance = odds();
				return chance > 60 && s.length <= 15
				? s.push(m.member)
				: chance > 10
				? n.push(m.member)
				: f.push(m.member);
			});

			// update their pocket values
			const coins = Math.round(vicCoins / s.length);
			await Promise.all([s.map(async m => {
				const data = await ctx.db.fetch(m.user.id, false);
				return data.addPocket(coins).save();
			})]);
			await Promise.all([f.map(async m => {
				const data = await ctx.db.fetch(m.user.id, false);
				return data.removePocket(data.data.pocket).save();
			})]);

			// message mapping (this probably sucks tbh)
			const success = s.length >= 1 ? s.map(m => `+ ${niceMsg
				.replace(/{user}/g, m.user.username)
				.replace(/{got}/g, coins.toLocaleString())
			}`) : [];
			const nothing = n.length >= 1 ? n.map(m => `# ${nullMsg
				.replace(/{user}/g, m.user.username)
			}`) : [];
			const fail = f.length >= 1 ? f.map(m => `- ${ripMsg
				.replace(/{user}/g, m.user.username)
			}`) : [];

			// final
			if (success.length >= 1) await vicEntry.withdraw(vicCoins).removePocket(vicCoins).save();
			let content = `**Good job everybody! We racked up \`${coins.toLocaleString()}\` coins each!**`;
			content += `\n${'```diff'}\n${[...fail, ...nothing].sort(() => Math.random() - 0.5).join('\n')}\n${success.join('\n')}\n${'```'}`;
			await finish();
			return ctx.send({ content });
		};

		collector.on('collect', onCollect);
		collector.on('end', onEnd);
	}
}
