import { MessagePlus } from '@lib/extensions/message';
import { Listener } from '@lib/handlers/listener';
import { Item } from '@lib/handlers/item';

export default class QuestListener extends Listener {
	constructor() {
		super('itemBuy', {
			emitter: 'quest',
			event: 'itemBuy'
		});
	}

	async exec(args: {
		msg: MessagePlus,
		item: Item,
		amount: number
	}) {
		const { quest: q, item: i } = this.client.handlers;
		const { msg, item, amount } = args;
		const quests = q.modules;
		const items = i.modules;

		if (!this.client.isOwner(msg.author)) return;

		const data = await msg.author.fetchDB();
		const { quest } = data;

		const aq = quests.get(data.quest.id);
		if (!aq) return;

		quest.count += amount;
		await data.save();

		if (quest.count >= quest.target) {
			const coinR = aq.rewards.coins.toLocaleString();
			const item = items.get(aq.rewards.item[1]);
			const itemR = `${aq.rewards.item[0]} ${item.emoji} ${item.name}`;

			quest.id = '';
			quest.count = 0;
			quest.target = 0;
			await data.save();

			return await msg.channel.send({
				replyTo: msg.id,
				content: `**Quest Finished!**\nYou successfully finished the **${aq.name}** quest.\nYou got **${coinR}** coins and **${itemR}** as a reward.`
			});
		}
	}
}