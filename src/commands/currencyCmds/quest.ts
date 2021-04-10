import { MessageOptions } from 'discord.js';
import { MessagePlus } from '@lib/extensions/message';
import { Command } from '@lib/handlers/command';
import { Embed } from '@lib/utility/embed';
import { Quest } from '@lib/handlers/quest';
import { Item } from '@lib/handlers/item';

export default class Currency extends Command {
  constructor() {
    super('quest', {
      aliases: ['quest', 'q'],
      channel: 'guild',
      description: 'View or enter a quest you want.',
      category: 'Currency',
      ownerOnly: true,
      cooldown: 35e3,
      args: [
        {
          id: 'query',
          type: (msg: MessagePlus, phrase: string) => {
            if (!phrase) return 1; // quest page
            const res = this.handler.resolver;
            return (
              res.type('number')(msg, phrase) 
              || res.type('questQuery')(msg, phrase)
            );
          },
        },
      ],
    });
  }

  async exec(
    msg: MessagePlus,
    { query }: { query: number | (Quest | 'stop') }
  ): Promise<string | MessageOptions> {
    const { quest: Handler } = this.client.handlers;
    const quests = Handler.modules.array();

    if (typeof query === 'number') {
      const quest = this.client.util.paginateArray(
        quests
          .sort((a, b) => a.diff - b.diff)
          .map((q) => {
            const { name, info, rawDiff, rewards } = q;
            const itemRew = rewards.item;
            const mods = this.client.handlers.item.modules;
            const [amt, item]: [number, Item] = [itemRew[0], mods.get(itemRew[1])];
            const r = [`${rewards.coins.toLocaleString()} coins`, `${amt.toLocaleString()} ${item.emoji} ${item.name}`];

            return `**${name}** — ${rawDiff}\n${info}\n[\`REWARDS\`](https://discord.gg/memer) **${r.join('** and **')}**`;
          }),
        3
      );

      if (query > quest.length) {
      	return "That page doesn't even exist lol";
      }

      return { embed: {
        footer: { text: `Lava Quests — Page ${query} of ${quest.length}` },
        title: 'Lava Quests',
        color: 'RANDOM',
        fields: [
          {
            name: 'Quest List',
            value: quest[(query as number) - 1].join('\n\n')
          }
        ]
      }};
    }

    const mods = this.client.handlers.quest.modules;
    const data = await msg.author.fetchDB();

    if (!query) {
      return 'That isn\'t even a valid quest or page number bruh';
    }

    if (query.constructor instanceof Quest) {
      const quest = data.quest;
      if (quest.id || quest.target >= 1) {
        return { replyTo: msg.id, content: 'you can\'t enter a quest because you\'re have an active one' };
      }

      quest.target = (query as Quest).target;
      quest.count = 0;
      quest.id = (query as Quest).id;
      await data.save();
      return { replyTo: msg.id, content: `You're now doing the **${(query as Quest).name}** quest!` };
    }

    if (query === 'stop') {
      const aq = data.quest;
      const active = mods.get(aq.id);
      aq.target = 0;
      aq.count = 0;
      aq.id = '';
      return `You now stopped your **${active.name}** quest, thanks for nothing idiot.`;
    }
  }
}
