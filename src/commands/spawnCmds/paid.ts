import { Message, MessageOptions } from 'discord.js';
import { MessagePlus } from '@lib/extensions/message';
import { Command } from '@lib/handlers/command';
import { Embed } from '@lib/utility/embed';

export default class Spawn extends Command {
  constructor() {
    super('paid', {
      aliases: ['paid'],
      description: 'Updates someone elses or your lava unpaid amounts',
      category: 'Spawn',
      userPermissions: ['MANAGE_MESSAGES'],
      args: [
        {
          id: 'amount',
          type: 'number',
          unordered: true,
        },
        {
          id: 'member',
          type: 'member',
          unordered: true,
          default: (message: MessagePlus) => message.member,
        },
      ],
    });
  }

  async exec(
    msg: MessagePlus,
    args: {
      amount: number;
      member: Message['member'];
    }
  ): Promise<string | MessageOptions> {
    const { fetch, remove } = this.client.db.spawns;
    const { amount, member } = args;
    if (!amount) return 'You need an amount';
    else if (!member) return 'You need a user';

    const bot = this.client.user;
    const old = await fetch(member.user.id);
    const d = await remove(member.user.id, 'unpaid', amount);
    const embed = new Embed()
      .addField('• Old Value', old.unpaid.toLocaleString())
      .addField('• New Value', d.unpaid.toLocaleString())
      .setTitle(':white_check_mark: Unpaids Updated.')
      .setFooter(true, bot.username, bot.avatarURL())
      .setColor('GREEN');

    return { embed };
  }
}
