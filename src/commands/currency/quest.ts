import { MessageOptions } from 'discord.js';
import { Context } from 'lib/extensions/message';
import { Command } from 'lib/handlers/command';
import { Embed } from 'lib/utility/embed';
import { Quest } from 'lib/handlers/quest';
import { Item } from 'lib/handlers/item';

export default class Currency extends Command {
  constructor() {
    super('quest', {
      aliases: ['quest', 'q'],
      channel: 'guild',
      description: 'View, enter or stop a quest.',
      category: 'Currency',
      cooldown: 3e3,
      args: [
        {
          id: 'query',
          type: (msg: Context, phrase: string) => {
            if (!phrase) return 1; // quest page
            const res = this.handler.resolver;
            return (
              res.type('number')(msg, phrase) ||
              res.type('questQuery')(msg, phrase)
            );
          },
        },
      ],
    });
  }

  async exec(
    ctx: Context<{ query: number | Quest | 'stop' }>
  ): Promise<MessageOptions> {
    const { quest: Handler } = this.client.handlers;
    const { query } = ctx.args;
    const quests = Handler.modules.array();

    if (typeof query === 'number') {
      const quest = this.client.util.paginateArray(
        quests
          .sort((a, b) => a.diff - b.diff)
          .map((q) => {
            const { name, info, rawDiff, rewards, emoji } = q;
            const itemRew = rewards.item;
            const mods = this.client.handlers.item.modules;
            const [amt, item]: [number, Item] = [
              itemRew[0],
              mods.get(itemRew[1]),
            ];
            const r = [
              `${rewards.coins.toLocaleString()} coins`,
              `${amt.toLocaleString()} ${item.emoji} ${item.name}`,
            ];

            return `**${emoji} ${name}** — ${
              rawDiff }\n${ info
            }\n[\`REWARDS\`](https://google.com) **${r.join(
              '** and **'
            )}**`;
          }),
        3
      );

      if (query > quest.length) {
        return { replyTo: ctx.id, content: `Page \`${query as number}\` doesn't exist.` };
      }

      return { embed: {
        description: `Simply do \`${this.handler.prefix[0]} ${this.id} <quest>\` to enter a quest, \`${this.id} check\` to see your active quest and \`${this.id} stop\` to stop an active quest.`,
        footer: { text: `Lava Quests — Page ${query} of ${quest.length}` },
        title: 'Lava Quests', color: 'RANDOM', fields: [{
          name: 'Quest List', value: quest[(query as number) - 1].join('\n\n'),
        }],
      }};
    }

    const mods = this.client.handlers.quest.modules;
    const userEntry = await ctx.db.fetch();
    const { data } = userEntry;

    if (!query) {
      return { replyTo: ctx.id, content: "That isn't even a valid quest or page number bruh" };
    }

    if (query instanceof Quest) {
      const mod = query as Quest;
      const aq = data.quest;
      if (aq.id) return { replyTo: ctx.id, content: "you can't enter a quest because you have an active one" };

      await userEntry.startQuest(mod.id, { target: mod.target[0], type: mod.target[2] }).save();
      return { replyTo: ctx.id, content: `You're now doing the **${mod.emoji} ${mod.name}** quest!` };
    }

    if (query === 'stop') {
      const aq = data.quest;
      if (!aq.id) return { content: "You don't have an active quest right now.", replyTo: ctx.id };

      const active = mods.get(aq.id);
      await userEntry.stopQuest().save();
      return { replyTo: ctx.id, content: `You stopped your **${active.emoji} ${active.name}** quest, thanks for nothing idiot.` };
    }

    if (query === 'check') {
      const aq = data.quest;
      if (!aq.id) return { content: "You don't have an active quest right now.", replyTo: ctx.id };

      const mod = mods.get(aq.id);
      return { replyTo: ctx.id, embed: {
        color: 'ORANGE', title: `${mod.emoji} ${mod.name} — ${mod.rawDiff}`,
        description: mod.info, fields: [{ 
          value: `**${aq.count.toLocaleString()} / ${mod.target[0].toLocaleString()}**`,
          name: 'Current Progress', 
        }], timestamp: Date.now(), footer: { 
          iconURL: ctx.client.user.avatarURL(),
          text: ctx.client.user.username
        }
      }};
    }
  }
}
