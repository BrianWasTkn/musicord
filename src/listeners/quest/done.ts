import { QuestHandler, Quest } from 'lib/handlers/quest';
import { Listener, Command } from 'lib/handlers';
import { Context } from 'lib/extensions/message';
import { Item } from 'lib/handlers/item';

export default class QuestListener extends Listener<QuestHandler<Quest>> {
  constructor() {
    super('done', {
      emitter: 'quest',
      event: 'done',
    });
  }

  async exec(args: { mod: Quest, ctx: Context }) {
    const { item: { modules: items } } = args.ctx.client.handlers;
    const { mod, ctx } = args;

    const entry = await ctx.db.fetch();
  	const item = items.get(mod.rewards.item[1]);
  	const coinR = mod.rewards.coins.toLocaleString();
  	const itemR = `${mod.rewards.item[0]} ${item.emoji} ${item.name}`;

  	const inv = item.findInv(entry.data.items, item);
  	await entry.addInv(item.id, mod.rewards.item[0]).addPocket(mod.rewards.coins).stopQuest().save();
  	let content = `**${mod.emoji} Quest Finished!**`;
  	content += `\nYou successfully finished the **${mod.name}** quest.`;
  	content += `\nYou got **${coinR}** coins and **${itemR}** as your reward.`;
  	return await ctx.send({ replyTo: ctx.id, content });
  }
}
