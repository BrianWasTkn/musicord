import { MessageOptions } from 'discord.js';
import { SpawnDocument } from '@lib/interface/mongo/spawns';
import { MessagePlus } from '@lib/extensions/message';
import { Command } from '@lib/handlers/command';

import Mongo, { Document } from 'mongoose';

export default class Spawn extends Command {
  constructor() {
    super('srich', {
      aliases: ['srich'],
      description: 'View the leaderboard for spawns.',
      category: 'Spawn',
      cooldown: 1e4,
      args: [
        { id: 'amount', type: 'number', default: 10 },
      ],
    });
  }

  async exec(
    msg: MessagePlus,
    args: { amount: number }
  ): Promise<MessageOptions> {
    const emojis = ['first_place', 'second_place', 'third_place'];
    msg.channel.send({ replyTo: msg.id, content: 'Fetching...' });
    const count = args.amount;

    const docs = (await Mongo.models['spawn-profile'].find({})) as (Document & SpawnDocument)[];
    const filt = docs.filter(s => s.unpaid < Infinity && s.unpaid > 0).sort((a, b) => b.unpaid - a.unpaid).slice(0, count);
    const rich = filt.map((f, i) => {
      const user = msg.guild.members.cache.get(f.userID);
      return `:${emojis[i] || 'eggplant'}: **${f.unpaid.toLocaleString()}** - ${user.user.tag || 'LOL WHO DIS'}`;
    });

    return { embed: {
      author: { name: 'top unpaids' },
      description: rich.join('\n'),
      color: 'ORANGE', footer: {
        iconURL: msg.client.user.avatarURL(),
        text: msg.client.user.username,
      }
    }};
  }
}
