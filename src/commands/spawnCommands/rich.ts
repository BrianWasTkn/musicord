import { Context, MemberPlus } from 'lib/extensions';
import { MessageOptions } from 'discord.js';
import { Command } from 'lib/objects';

import Mongo, { Document } from 'mongoose';

export default class Spawn extends Command {
  constructor() {
    super('srich', {
      aliases: ['srich'],
      description: 'View the leaderboard for spawns.',
      category: 'Spawn',
      args: [
        { id: 'count', type: 'number', default: 10 }
      ],
    });
  }

  async exec(ctx: Context<{ count: number }>): Promise<MessageOptions> {
    const emojis = ['first_place', 'second_place', 'third_place'];
    const { count } = ctx.args; ctx.send({ 
      replyTo: ctx.id, content: 'Fetching...' 
    });

    const docs = (await Mongo.models['spawn-profile'].find({})) as (Document &
      Spawns.Data)[];
    const filt = docs
      .filter((s) => s.unpaid < Infinity && s.unpaid > 0)
      .sort((a, b) => b.unpaid - a.unpaid)
      .slice(0, count > 30 ? 30 : (count < 1 ? 1 : 10));
    const rich = filt.map((f, i) => {
      const user = ctx.guild.members.cache.get(f.userID) || '**LOL WHO DIS**';
      return `:${emojis[i] || 'eggplant'}: **${f.unpaid.toLocaleString()}** - ${
        typeof user === 'object' ? (user as MemberPlus).user.tag : user
      }`;
    });

    return { replyTo: ctx.id, embed: {
      author: { name: 'top unpaids' },
      description: rich.join('\n'),
      color: 'ORANGE', footer: {
        iconURL: ctx.client.user.avatarURL(),
        text: ctx.client.user.username,
      },
    }};
  }
}
