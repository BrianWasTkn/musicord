import { QuestHandler, Quest } from 'lib/handlers/quest';
import { Listener } from 'lib/handlers/listener';
import { Context } from 'lib/extensions/message';
import { Item } from 'lib/handlers/item';

export default class QuestListener extends Listener<QuestHandler<Quest>> {
  constructor() {
    super('itemShare', {
      emitter: 'quest',
      event: 'itemShare',
    });
  }

  async exec(args: { ctx: Context; amount: number; itemArg: Item }) {
    const { ctx, amount, itemArg } = args;
    const { 
      item: { modules: items },
      quest: { modules: quests }, 
    } = this.client.handlers;

    const entry = await ctx.db.fetch();
    if (!entry.data.quest.id) return;
    const mod = quests.get(entry.data.quest.id);
    if (Array.isArray(mod.target[1])) {
      const itemId = mod.target[1][1];
      if (itemArg.id !== itemId) return;
    }
    
    await entry.updateQuest(amount).save();
    if (entry.data.quest.count >= mod.target[0]) {
      return this.emitter.emit('done', { mod, ctx });
    }
  }
}
