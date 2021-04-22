import { QuestHandler, Quest } from 'lib/handlers/quest';
import { Listener } from 'lib/handlers/listener';
import { Context } from 'lib/extensions/message';
import { Item } from 'lib/handlers/item';

export default class QuestListener extends Listener<QuestHandler<Quest>> {
  constructor() {
    super('itemBuy', {
      emitter: 'quest',
      event: 'itemBuy',
    });
  }

  async exec(args: { ctx: Context; item: Item; amount: number }) {
    const { quest: q, item: i } = this.client.handlers;
    const { ctx, item, amount } = args;
    const quests = q.modules;
    const items = i.modules;

    if (!this.client.isOwner(ctx.author)) return;

    const { data } = await ctx.db.fetch();
    const { quest } = data;

    const aq = quests.get(quest.id);
    if (!aq) return;

    quest.count += amount;
    await data.save();

    if (quest.count >= quest.target) {
      const coinR = aq.rewards.coins.toLocaleString();
      const item = items.get(aq.rewards.item[1]);
      const itemR = `${aq.rewards.item[0]} ${item.emoji} ${item.name}`;

      const inv = data.items.find((i) => i.id === item.id);
      inv.amount += aq.rewards.item[0];
      data.pocket += aq.rewards.coins;

      quest.id = '';
      quest.count = 0;
      quest.target = 0;
      await data.save();

      return await ctx.send({
        replyTo: ctx.id,
        content: `**Quest Finished!**\nYou successfully finished the **${aq.name}** quest.\nYou got **${coinR}** coins and **${itemR}** as a reward.`,
      });
    }
  }
}
