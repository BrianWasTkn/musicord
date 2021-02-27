import { Command } from 'discord-akairo';
import { Message, MessageEmbed } from 'discord.js';
import { Lava } from '@lib/Lava';

export default class Spawn extends Command {
  client: Lava;

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
          id: 'user',
          type: 'member',
          unordered: true,
          default: (message: Message) => message.member,
        },
      ],
    });
  }

  private async deleteMessage(m: Message): Promise<Message> {
    return m.delete({ timeout: 3000 });
  }

  async exec(_: Message, args: any): Promise<Message> {
    const { amount, user } = args;
    // Args
    if (!amount) return _.reply('You need an amount.').then(this.deleteMessage);
    else if (!user) return _.reply('You need a user.').then(this.deleteMessage);
    // Update
    const data = await this.client.db.spawns.removeUnpaid(user.user.id, amount);
    // Message
    const embed = new MessageEmbed()
      .setAuthor(
        `Updated: ${user.user.tag}`,
        user.user.avatarURL({ dynamic: true })
      )
      .setFooter(this.client.user.username, this.client.user.avatarURL())
      .addField('Total Unpaids Left', data.unpaid.toLocaleString())
      .setTimestamp(Date.now())
      .setColor('ORANGE');

    return _.channel.send({ embed });
  }
}
