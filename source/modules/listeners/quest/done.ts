import { QuestHandler, Listener, Command, Quest, Item } from 'lib/objects';
import { Context } from 'lib/extensions';

export default class QuestListener extends Listener<QuestHandler<Quest>> {
	constructor() {
		super('done', {
			emitter: 'quest',
			event: 'done',
		});
	}

	exec(args: { ctx: Context, quest: Quest, itemR: string, coinR: string }) {
		const { quest, itemR, coinR, ctx } = args;
		let content = `**${quest.emoji} Quest Finished!**`;
		content += `\nYou successfully finished the **${quest.name}** quest.`;
		content += `\nYou got **${coinR}** coins and **${itemR}** as your reward.`;
		return ctx.send({ reply: { messageReference: ctx.id, failIfNotExists: false }, content });
	}
}
