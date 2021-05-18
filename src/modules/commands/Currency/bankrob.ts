import { Collection, Message, MessageOptions, CollectorFilter, MessageCollectorOptions } from 'discord.js';
import { MemberPlus, Context, ContextDatabase } from 'lib/extensions';
import { Command } from 'lib/objects';
import { Heist } from 'lib/utility/heist';

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
		const entries = new Collection<string, Heist>([[ctx.author.id, new Heist(ctx, userEntry)]]);
		ctx.client.util.curHeist.set(ctx.guild.id, true);
		
		const options: MessageCollectorOptions = { max: Infinity, time: 6e4 };
		const filter: CollectorFilter<[Context]> = m => m.content.toLowerCase() === 'join heist';
		const collector = ctx.channel.createMessageCollector(filter as (
			(m: Message) => boolean
		), options);

		const onCollect = async (m: Context) => {
			const heistEntry = await (new ContextDatabase(m)).fetch(m.author.id);
			const remove = (id: string) => entries.delete(id);
			entries.set(m.id, new Heist(ctx, heistEntry));

			if (entries.filter(e => e.ctx.author.id === m.author.id).size > 1) {
				remove(m.id); return m.reply('You already joined bruh');
			}
			if (m.author.id === user.id) {
				remove(m.id); return m.reply(`You ain't allowed to join because you're being heisted HAHAHAHA`);
			}
			if (heistEntry.data.pocket < min) {
				remove(m.id); return m.reply(`You need ${min} coins to join LMAO`);
			}

			await heistEntry.removePocket(min).save();
			return m.react('🏦');
		};

		const onEnd = async (_: Collection<string, Context>, reason?: string) => {
			const { randomNumber, randomInArray } = ctx.client.util;
			await vicEntry.beingHeisted(false).save();
			const odds = () => randomNumber(1, 100);
			ctx.client.util.curHeist.delete(ctx.guild.id);

			// Caught
			if (reason === 'caught') {
				return ctx.reply('Nice, heist cancelled because you got caught.');
			}

			// The host is heisting with dead souls
			if (entries.size <= 1) {
				return ctx.reply('Well looks like you\'re alone.');
			};

			// Random Amount (50% or 100%)
			vicCoins = Math.round(randomInArray([vicCoins, vicCoins / 2]));
			// end message
			await ctx.reply(`\`${entries.size}\` people are teaming up against **${user.username}** for **${vicCoins.toLocaleString()}** coins...`);

			// Loop through all entries and randomly fine, win or die them. 
			const results = await Promise.all([...entries.values()].map(entry => {
				return {
					1: entry.win(vicCoins -= randomNumber(1, vicCoins)),
					2: entry.fine(randomNumber(1, entry.entry.data.pocket)),
					3: entry.die()
				}[randomNumber(1, 3)].entry.save()
				.then((doc) => ({ doc, entry }));
			}));

			// Everyone Failed
			if (results.every(r => r.entry.status === 'died')) {
				await ctx.channel.send('**:skull: Everybody died LOL :skull:**');
				return ctx.channel.send(results.map(r => `- ${r.entry.msg}`).join('\n'), { code: 'diff' })
			}

			// The painful part of making this command
			const diffSym = { 'fined': '#', 'died': '-', 'won': '+' };
			const block = results.map(r => `${diffSym[r.entry.status]} ${r.entry.msg}`);
			await vicEntry.withdraw(vicCoins).removePocket(vicCoins).save();
			let content = `**Good job everybody!** We got a total of \`${vicCoins.toLocaleString()}\` coins!`;
			content += `\n${'```diff'}\n${block.sort(() => Math.random() - 0.5).join('\n')}\n${'```'}`;
			return ctx.send({ content });
		};

		collector.on('collect', onCollect);
		collector.on('end', onEnd as (c: Collection<string, Message>, r?: string) => any);
		ctx.client.util.currencyHeists.set(ctx.guild.id, collector);
	}
}
