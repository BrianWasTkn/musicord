import { QuestHandler, Quest } from 'lib/handlers/quest';
import { Listener } from 'lib/handlers/listener';
import { Context } from 'lib/extensions/message';
import { Item } from 'lib/handlers/item';

export default class QuestListener extends Listener<QuestHandler<Quest>> {
  constructor() {
    super('marry', {
      emitter: 'quest',
      event: 'marry',
    });
  }

  async exec(args: { ctx: Context }) {
    const { ctx } = args, { 
      item: { modules: items },
      quest: { modules: quests }, 
    } = this.client.handlers;

    const entry = await ctx.db.fetch();
    if (!entry.data.quest.id) return;
    const mod = quests.get(entry.data.quest.id);
    if ('marry' !== mod.target[1]) return;
    await entry.updateQuest(1).save();

    if (entry.data.quest.count >= mod.target[0]) {
      return this.emitter.emit('done', { mod, ctx });
    }
  }
}
