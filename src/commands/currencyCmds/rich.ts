import { CurrencyProfile } from '@lib/interface/mongo/currency';
import { MessageOptions } from 'discord.js';
import { Context } from '@lib/extensions/message';
import { UserPlus } from '@lib/extensions/user';
import { Command } from '@lib/handlers/command';
import Mongo, { Document } from 'mongoose';

export default class Currency extends Command {
  constructor() {
    super('rich', {
      aliases: ['rich', 'r'],
      channel: 'guild',
      description: 'View top users locally or globally.',
      category: 'Currency',
      cooldown: 1e4,
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

  async exec(ctx: Context<{
    type: keyof CurrencyProfile;
    isGlobal: boolean;
  }>): Promise<MessageOptions> {
    const { randomInArray } = this.client.util;
    const { isGlobal: glob } = ctx.args;
    const emojis = ['first_place', 'second_place', 'third_place'];
    const mjs = ['eggplant', 'skull', 'clown', 'kiss'];
    ctx.send({ replyTo: ctx.id, content: 'Fetching...' });
    
    if (glob) {
      const docs = (await Mongo.models['currency'].find({})) as (Document & CurrencyProfile)[];
      const lava = docs.filter(n => n.pocket > 0).sort((a, b) => b.pocket - a.pocket).slice(0, 10);
      const nice = await Promise.all(lava.map((l, i) => ctx.client.users.fetch(l.userID, false, true).then(o => ({ o: o as UserPlus, pocket: l.pocket }))));
      const rich = nice.filter(n => !n.o.bot).map((n, i) => `:${emojis[i] || randomInArray(mjs)}: **${n.pocket.toLocaleString()}** — ${n.o.tag}`);
    
      return { embed: {
        author: { name: 'richest discord players' },
        description: rich.join('\n'),
        color: 'ORANGE', footer: {
          iconURL: ctx.client.user.avatarURL(),
          text: ctx.client.user.username + ' — Showing Pockets',
        }
      }};
    }

    const documents = await Mongo.models['currency'].find({}) as (Document & CurrencyProfile)[];
    const mebDocs = (await ctx.guild.members.fetch({ force: true })).array().map(({ user }) => documents.find(doc => doc.userID === user.id));
    const abcde = mebDocs.filter(Boolean).filter(m => m.pocket > 0).sort((a, b) => b.pocket - a.pocket).slice(0, 10);
    const filt = (await Promise.all(abcde.map(async d => ({
      member: await ctx.guild.members.fetch({ user: d.userID }),
      pocket: d.pocket
    })))).filter(m => !m.member.user.bot);

    return { embed: {
      author: { name: 'richest players in this server' },
      description: filt.map((n, i) => `:${emojis[i] || randomInArray(mjs)}: **${n.pocket.toLocaleString()}** — ${n.member.user.tag || '**LOL WHO DIS**'}`).join('\n'),
      color: ctx.member.displayHexColor, footer: {
        iconURL: ctx.guild.iconURL({ dynamic: true }),
        text: ctx.guild.name + ' — Showing Pockets',
      }
    }};
  }
}
