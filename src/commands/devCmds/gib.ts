import { GuildMember, MessageOptions } from 'discord.js';
import { UserPlus, MessagePlus } from '@lib/extensions';
import { Argument } from 'discord-akairo';
import { Document } from 'mongoose';
import { Command } from '@lib/handlers/command';

export default class Currency extends Command {
  constructor() {
    super('gib', {
      aliases: ['gib', 'g'],
      description: 'Gib coins to users.',
      category: 'Dev',
      ownerOnly: true,
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
        },
      ],
    });
  }

  public async exec(
    msg: MessagePlus,
    args: {
      member: GuildMember;
      amount: number;
    }
  ): Promise<string | MessageOptions> {
    const { member, amount } = args;
    const { maxSafePocket } = this.client.config.currency;
    const { user } = member;
    if (!member || !amount) return;

    const r = await (user as UserPlus).fetchDB();
    if (isNaN(amount)) return 'Needs to be a whole number yeah?';
    let { pocket } = await msg.dbAdd(member.user.id, 'pocket', amount);
    await msg.react('✅');
  }
}
