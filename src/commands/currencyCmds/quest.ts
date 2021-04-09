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
            const { resolver } = this.handler;
            return (
              resolver.type('number')(msg, phrase) ||
              resolver.type('questQuery')(msg, phrase) ||
              phrase.toLowerCase().slice(0, 3) === 'stop' 
                ? 'stop' : null
            );
          },
        },
      ],
    });
  }

  async exec(
    msg: MessagePlus,
    { query }: { query: number | Quest | string }
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

    const data = await msg.author.fetchDB();
    const items = this.client.handlers.item.modules;
    const q = data.quest;

    if (!query) {
      return "That quest isn't even in the list what're you doing?";
    }
    if (data.quest.id && query !== 'stop') {
      return "You already have an active quest going on!";
    }
    if (query === 'stop') {
      const active = this.client.handlers.quest.modules.get(q.id);
      q.target = 0;
      q.count = 0;
      q.id = '';
      return `You now stopped your **${active.name}** quest, thanks for nothing idiot.`;
    }

    q.target = (query as Quest).target;
    q.count = 0;
    q.id = (query as Quest).id;
    await data.save();

    return { replyTo: msg.id, content: `You're now doing the **${(query as Quest).name}** quest!` };
  }
}
