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
    const { ctx, item, amount } = args;
    const { 
      item: { modules: items },
      quest: { modules: quests }, 
    } = this.client.handlers;

    const { data } = await ctx.db.fetch();
    const { quest } = data;

    // &
    const mod = quests.get(quest.id);
    if (Array.isArray(mod.target[1])) {
      const [,itemId] = mod.target[1];
      if (item.id !== itemId) return;
    }

    quest.count += amount;
    await data.save();

    if (quest.count >= mod.target[0]) {
      const item = items.get(mod.rewards.item[1]);
      const coinR = mod.rewards.coins.toLocaleString();
      const itemR = `${mod.rewards.item[0]} ${item.emoji} ${item.name}`;

      const inv = data.items.find((i) => i.id === item.id);
      inv.amount += mod.rewards.item[0];
      data.pocket += mod.rewards.coins;

      quest.id = '';
      quest.count = 0;
      quest.target = 0;
      await data.save();

      return await ctx.send({
        replyTo: ctx.id,
        content: `**${mod.emoji} Quest Finished!**\nYou successfully finished the **${mod.name}** quest.\nYou got **${coinR}** coins and **${itemR}** as your reward.`,
      });
    }
  }
}
