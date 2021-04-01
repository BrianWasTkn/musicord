import { CurrencyProfile } from '@lib/interface/mongo/currency';
import { MessageOptions } from 'discord.js';
import { MessagePlus } from '@lib/extensions/message';
import { Command } from '@lib/handlers/command';
import Model from '@lib/mongo/currency/model';

import Mongo, { Document } from 'mongoose';

export default class Currency extends Command {
  constructor() {
    super('rich', {
      aliases: ['rich', 'r'],
      channel: 'guild',
      description: 'View top users locally or globally.',
      category: 'Currency',
      cooldown: 1e3,
      args: [
        {
          id: 'isGlobal',
          type: 'boolean',
          flag: ['--global', '-g'],
          default: false,
        },
      ],
    });
  }

  async exec(
    msg: MessagePlus,
    args: {
      isGlobal: boolean;
      type: keyof CurrencyProfile;
    }
  ): Promise<MessageOptions> {
    const rich = (await Mongo.models['currency'].find({})) as (Document & CurrencyProfile)[];
    const nice = rich
      .filter((doc) =>
        args.isGlobal ? doc : msg.guild.members.cache.get(doc.userID)
      )
      .slice(0, 10)
      .sort((a, b) => b.pocket - a.pocket)
      .map(async (doc, i) => {
        const u = await this.client.users.fetch(doc.userID);
        const isTop = i <= 2;

        return `${
          isTop ? ':fire:' : ':white_small_square:'
        } **${doc.pocket.toLocaleString()}** — ${u.tag}`;
      });

    return { embed: {
        title: `Richest Players — ${args.isGlobal ? 'Global' : msg.guild.name}`,
        color: 'GOLD',
        description: (await Promise.all(nice)).join('\n'),
        footer: {
          text: `Showing — Pockets`,
        },
    }};
  }
}
