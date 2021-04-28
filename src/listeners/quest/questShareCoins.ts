import { QuestHandler, Quest } from 'lib/handlers/quest';
import { Listener } from 'lib/handlers/listener';
import { Context } from 'lib/extensions/message';
import { Item } from 'lib/handlers/item';

export default class QuestListener extends Listener<QuestHandler<Quest>> {
  constructor() {
    super('coinShare', {
      emitter: 'quest',
      event: 'coinShare',
    });
  }

  async exec(args: { ctx: Context; paid: number }) {
    const { ctx, paid } = args;
    const { 
      item: { modules: items },
      quest: { modules: quests }, 
    } = this.client.handlers;

    const entry = await ctx.db.fetch();
    if (!entry.data.quest.id) return;
    const mod = quests.get(entry.data.quest.id);
    if ('give' !== mod.target[1]) return;
    await entry.updateQuest(paid).save();

    if (entry.data.quest.count >= mod.target[0]) {
      return this.emitter.emit('done', { mod, ctx });
    }
  }
}
