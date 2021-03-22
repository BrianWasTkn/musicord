import { Message, GuildMember, MessageOptions } from 'discord.js';
import { Command } from '@lib/handlers/command';
import { Embed } from '@lib/utility/embed';

export default class Currency extends Command {
  constructor() {
    super('active', {
      aliases: ['active', 'a'],
      channel: 'guild',
      description: 'View your active items.',
      category: 'Currency',
      cooldown: 5e3,
    });
  }

  public async exec(msg: Message): Promise<string | MessageOptions> {
    const data = await this.client.db.currency.fetch(msg.author.id);
    const actives = data.items
      .filter(i => i.expire > msg.createdTimestamp)
      .map(i => {
        const item = this.client.handlers.item.modules.get(i.id);
        const expire = this.client.util.parseTime(Math.floor((i.expire - Date.now()) / 1e3));
        return `**${item.emoji} ${item.name}** — **Expires** in **${expire.join('**, **')}**`
      });

    if (!actives) return 'You don\'t have any active items!';

    return { embed: {
      title: `${actives.length} active items`,
      description: actives.join('\n'),
      color: 'RANDOM',
    }};
  }
}
