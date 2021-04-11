import { MessageOptions } from 'discord.js';
import { MessagePlus } from '@lib/extensions/message';
import { Command } from '@lib/handlers/command';

export default class Currency extends Command {
  constructor() {
    super('active', {
      aliases: ['active', 'ac'],
      channel: 'guild',
      description: 'View your active items.',
      category: 'Currency',
      cooldown: 5e3,
    });
  }

  public async exec(msg: MessagePlus): Promise<string | MessageOptions> {
    const { handlers: { item }, util: { parseTime } } = this.client;
    const data = await msg.author.fetchDB();
    const stamp = msg.createdTimestamp;
    const actives = data.items
      .filter((i) => i.expire > stamp)
      .map((i) => {
        const it = item.modules.get(i.id);
        const expire = parseTime(Math.floor((i.expire - stamp) / 1e3));

        return `**${it.emoji} ${it.name}** — expires in ${expire}`;
      });

    if (actives.length < 1) {
      return "You don't have any active items!";
    }

    return { embed: {
      title: `${msg.author.username}'s active items`,
      description: actives.join('\n'),
      color: 'RANDOM',
    }};
  }
}
