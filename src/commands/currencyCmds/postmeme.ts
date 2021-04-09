import { GuildMember, MessageOptions } from 'discord.js';
import { MessagePlus } from '@lib/extensions/message';
import { Command } from '@lib/handlers/command';
import { Embed } from '@lib/utility/embed';

export default class Currency extends Command {
  constructor() {
    super('postmeme', {
      aliases: ['postmeme', 'pm'],
      channel: 'guild',
      description: "Post a meme on reddit.",
      category: 'Currency',
      cooldown: 1e3,
      examples: () => this.aliases[0]
    });
  }

  async exec(msg: MessagePlus) {
    const comp = this.client.handlers.item.modules.get('computer');
    const data = await msg.author.fetchDB();
    const inv = data.items.find(i => i.id === comp.id);

    if (inv.amount < 1) {
      return { content: `LOL buy a ${comp.name} first before posting a meme ty` };
    }

    const ret = await comp.use(msg) as string;
    return { content: ret };
  }
}
