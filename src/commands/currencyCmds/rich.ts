import { CurrencyProfile } from '@lib/interface/mongo/currency';
import { MessageOptions } from 'discord.js';
import { MessagePlus } from '@lib/extensions/message';
import { UserPlus } from '@lib/extensions/user';
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
    const { isGlobal: glob } = args;
    const emojis = ['first_place', 'second_place', 'third_place'];

    if (glob) {
      const docs = (await Mongo.models['currency'].find({})) as (Document & CurrencyProfile)[];
      const lava = docs.filter(n => n.pocket > 0).sort((a, b) => b.pocket - a.pocket).slice(0, 10);
      const nice = await Promise.all(lava.map((l, i) => msg.client.users.fetch(l.userID, false, true).then(o => ({ o: o as UserPlus, pocket: l.pocket }))));
      const rich = nice.map((n, i) => `:${emojis[i] || 'eggplant'}: **${n.pocket.toLocaleString()}** — ${n.o.tag}`);
    
      return { embed: {
        author: { name: 'richest players across discord' },
        description: rich.join('\n'),
        color: 'RANDOM', footer: {
          iconURL: msg.client.user.avatarURL(),
          text: msg.client.user.username + ' Showing Pockets',
        }
      }};
    }

    const documents = await Mongo.models['currency'].find({}) as (Document & CurrencyProfile)[];
    const mebDocs = (await msg.guild.members.fetch({ force: true })).array().map(({ user }) => documents.find(doc => doc.userID === user.id));
    const abcde = mebDocs.filter(Boolean).filter(m => m.pocket > 0).sort((a, b) => b.pocket - a.pocket).slice(0, 10);
    const filt = await Promise.all(abcde.map(async d => ({
      member: await msg.guild.members.fetch(d.userID),
      pocket: d.pocket
    })));

    return { embed: {
      author: { name: 'richest players in this server' },
      description: filt.map((n, i) => `:${emojis[i] || 'eggplant'}: **${n.pocket.toLocaleString()}** — ${n.member.user.tag}`).join('\n'),
      color: 'RANDOM', footer: {
        iconURL: msg.guild.iconURL({ dynamic: true }),
        text: msg.guild.name,
      }
    }};
  }
}
