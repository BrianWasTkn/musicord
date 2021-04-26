import { QuestHandler, Quest } from 'lib/handlers/quest';
import { Listener, Command } from 'lib/handlers';
import { Context } from 'lib/extensions/message';
import { Item } from 'lib/handlers/item';

export default class QuestListener extends Listener<QuestHandler<Quest>> {
  constructor() {
    super('vaultExpand', {
      emitter: 'quest',
      event: 'vaultExpand',
    });
  }

  async exec(args: { ctx: Context, itemArg: Item, gain: number }) {
    const { itemArg, ctx, gain } = args, { 
      item: { modules: items },
      quest: { modules: quests }, 
    } = this.client.handlers;

    const { data } = await ctx.db.fetch();
    const { quest } = data;

    const mod = quests.get(quest.id);
    if (Array.isArray(mod.target[1])) {
      const [,itemId] = mod.target[1];
      if (itemArg.id !== itemId) return;
    }

    quest.count += gain;
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
