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

    const entry = await ctx.db.fetch();
    if (!entry.data.quest.id) return;
    const mod = quests.get(entry.data.quest.id);
    if (Array.isArray(mod.target[1])) {
      const itemId = mod.target[1][1];
      if (itemArg.id !== itemId) return;
    }
    
    await entry.updateQuest(gain).save();
    if (entry.data.quest.count >= mod.target[0]) {
      return this.emitter.emit('done', { mod, ctx });
    }
  }
}
