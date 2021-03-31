import { Message, MessageOptions } from 'discord.js';
import { MessagePlus } from '@lib/extensions/message';
import { Argument } from 'discord-akairo';
import { Command } from '@lib/handlers/command';
import { Embed } from '@lib/utility/embed';
import { Quest } from '@lib/handlers/quest';
import { Item } from '@lib/handlers/item';

export default class Currency extends Command {
  constructor() {
    super('quest', {
      aliases: ['quest', 'q'],
      channel: 'guild',
      ownerOnly: true,
      description: 'View or enter a quest you want.',
      category: 'Currency',
      cooldown: 1000,
      args: [
        {
          id: 'query',
          type: (msg: MessagePlus, phrase: string) => {
            if (!phrase) return 1; // quest page
            const { resolver } = this.handler;
            return (
              resolver.type('number')(msg, phrase) ||
              resolver.type('questQuery')(msg, phrase)
            );
          },
        },
      ],
    });
  }

  async exec(
    msg: MessagePlus,
    { query }: { query: number | Quest }
  ): Promise<string | MessageOptions> {
    const { quest: Handler } = this.client.handlers;
    const quests = Handler.modules.array();
    const embed = new Embed();

    if (typeof query === 'number') {
      const quest = this.client.util.paginateArray(
        quests
          .sort((a, b) => b.diff - a.diff)
          .map((q) => {
            const { name, info, rawDiff, rewards } = q;
            const itemRew = rewards.item;
            const mods = this.client.handlers.item.modules;
            const [amt, item]: [number, Item] = [itemRew[0], mods.get(itemRew[1])];
            const r = [`${rewards.coins.toLocaleString()} coins`, `${amt.toLocaleString()} ${item.emoji} ${item.name}`];

            return `**${name}** — ${rawDiff}\n${info}\n[**\`REWARDS\`**](https://discord.gg/memer) **${r.join('** and **')}**`;
          }),
        3
      );

      if (query > quest.length) {
      	return "That page doesn't even exist lol";
      }
      
      embed
        .setFooter(false, `Lava Quests — Page ${query} of ${quest.length}`)
        .addField('Quest List', quest[(query as number) - 1].join('\n\n'))
        .setTitle('Lava Quests')
        .setColor('RANDOM');
    } else {
      if (!query)
        return "That quest isn't even in the list what're you doing?";
      const data = await msg.author.fetchDB();
      const inv = data.items.find((i) => i.id === query.id);
      const items = this.client.handlers.item.modules;
      const item = items.get(query.rewards.item[1]);

      let info: string[] = [];
      info.push(`**Coins:** ${query.rewards.coins.toLocaleString()}`);
      info.push(`**Item:** ${query.rewards.item[0]} ${item.emoji} ${item.name}`);

      embed
        .setTitle(`${query.name} — ${query.rawDiff}`)
        .addField('Description', query.info)
        .addField('Rewards', info.join('\n'))
        .setColor('RANDOM');
    }

    return { embed };
  }
}
