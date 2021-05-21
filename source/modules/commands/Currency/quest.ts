import { Context, ContextDatabase } from 'lib/extensions';
import { MessageOptions, Message } from 'discord.js';
import { Command, Quest, Item } from 'lib/objects';
import { Embed } from 'lib/utility';

export default class Currency extends Command {
	constructor() {
		super('quest', {
			name: 'Quests',
			aliases: ['quest', 'q'],
			channel: 'guild',
			description: 'View, enter or stop a quest.',
			category: 'Currency',
			cooldown: 3e3,
			args: [
				{
					id: 'query',
					type: ((msg: Context, phrase: string) => {
						if (!phrase) return 1; // quest page
						const res = this.handler.resolver;
						return (
							res.type('number')(msg, phrase) ||
							res.type('questQuery')(msg, phrase)
						);
					}) as (m: Message, a: string) => any,
				},
			],
		});
	}

	async exec(
		ctx: Context<{ query: number | Quest | 'stop' }>,
		userEntry: ContextDatabase
	): Promise<MessageOptions> {
		const { quest: Handler } = this.client.handlers;
		const quests = Handler.modules.array();
		const query = ctx.args.query;

		if (typeof query === 'number') {
			const quest = this.client.util.paginateArray(
				quests
					.sort((a, b) => a.diff - b.diff)
					.map((q) => {
						const { name, info, rawDiff, rewards, emoji } = q;
						const itemRew = rewards.item;
						const mods = this.client.handlers.item.modules;
						const [amt, item]: [number, Item] = [
							itemRew[0],
							mods.get(itemRew[1]),
						];
						const r = [
							`${rewards.coins.toLocaleString()} coins`,
							`${amt.toLocaleString()} ${item.emoji} ${item.name}`,
						];

						return `**${emoji} ${name}** — ${rawDiff}\n${info
							}\n[\`REWARDS\`](https://google.com) **${r.join(
								'** and **'
							)}**`;
					}),
				3
			);

			if (query > quest.length) {
				return { reply: { messageReference: ctx.id, failIfNotExists: false }, content: `Page \`${query as number}\` doesn't exist.` };
			}

			return {
				embed: {
					description: `Simply do \`${(this.handler.prefix as string[])[0]} ${this.id} <quest>\` to enter a quest, \`${this.id} check\` to see your active quest and \`${this.id} stop\` to stop an active quest.`,
					footer: { text: `Lava Quests — Page ${query} of ${quest.length}` },
					title: 'Lava Quests', color: 'RANDOM', fields: [{
						name: 'Quest List', value: quest[(query as number) - 1].join('\n\n'),
					}],
				}
			};
		}

		const mods = this.client.handlers.quest.modules;
		const { data } = userEntry;

		if (!query) {
			return { reply: { messageReference: ctx.id, failIfNotExists: false }, content: "That isn't even a valid quest or page number bruh" };
		}

		if (query instanceof Quest) {
			const aq = data.quest;
			if (mods.get(aq.id)) return { reply: { messageReference: ctx.id, failIfNotExists: false }, content: "You can't enter a quest because you have an active one" };

			const mod = query as Quest;
			await userEntry.startQuest(mod.id, { target: mod.target[0], type: mod.target[2] }).save();
			return { reply: { messageReference: ctx.id, failIfNotExists: false }, content: `You're now doing the **${mod.emoji} ${mod.name}** quest!` };
		}

		if (query === 'stop') {
			const aq = data.quest;
			if (!aq.id) return { content: "You don't have an active quest right now.", reply: { messageReference: ctx.id, failIfNotExists: false }, };

			const active = mods.get(aq.id);
			await userEntry.stopQuest().save();
			return { reply: { messageReference: ctx.id, failIfNotExists: false }, content: `You stopped your **${active.emoji} ${active.name}** quest, thanks for nothing idiot.` };
		}

		if (query === 'check') {
			const aq = data.quest;
			if (!aq.id) return { content: "You don't have an active quest right now.", reply: { messageReference: ctx.id, failIfNotExists: false }, };

			const mod = mods.get(aq.id);
			return {
				reply: { messageReference: ctx.id, failIfNotExists: false }, embed: {
					color: 'ORANGE', title: `${mod.emoji} ${mod.name} — ${mod.rawDiff}`,
					description: mod.info, fields: [{
						value: `**${aq.count.toLocaleString()} / ${mod.target[0].toLocaleString()}**`,
						name: 'Current Progress',
					}], timestamp: Date.now(), footer: {
						iconURL: ctx.client.user.avatarURL(),
						text: ctx.client.user.username
					}
				}
			};
		}
	}
}
