import { Message, MessageOptions } from 'discord.js';
import { CurrencyProfile } from '@lib/interface/mongo/currency';
import { SpawnDocument } from '@lib/interface/mongo/spawns';
import { Command } from '@lib/handlers/command';
import { Embed } from '@lib/utility/embed';
import mongoose from 'mongoose';

export default class Spawn extends Command {
  constructor() {
    super('top', {
      aliases: ['top', 't'],
      description: 'View global top leaderboards for both Currency and Spawns.',
      category: 'Spawn',
      args: [
        { id: 'type', type: 'string' },
        { id: 'amount', type: 'number' },
      ],
    });
  }

  private async map<T extends CurrencyProfile | SpawnDocument>(
    docs: (mongoose.Document & T)[],
    amount: number,
    key: string
  ): Promise<string[]> {
    let all = docs
      .filter((m: mongoose.Document & T) => m[key] < Infinity)
      .sort(
        (a: mongoose.Document & T, b: mongoose.Document & T) => b[key] - a[key]
      )
      .slice(0, amount)
      .map(async (m: mongoose.Document & T, i: number) => {
        const user = await this.client.users.fetch(m.userID);
        return `**#${i + 1}** *${m[key].toLocaleString()}* — **${
          user.tag
        }**` as string;
      });

    return await Promise.all(all);
  }

  async exec(
    _: Message,
    args: {
      amount: number;
      type: string;
    }
  ): Promise<MessageOptions> {
    let { type, amount } = args;
    type = type || 'unpaids';
    amount = amount || 10;

    let embed = new Embed();
    let docs: any[];
    let mapped: string[];

    switch (type) {
      case 'unpaids':
      case 'spawns':
      case 'unpaid':
      case 'spawn':
        docs = await mongoose.models['spawn-profile'].find({});
        mapped = await this.map<SpawnDocument>(docs, amount, 'unpaid');
        embed.setTitle(`Top ${amount} Unpaids`);
        break;

      case 'pockets':
      case 'wallets':
      case 'pocket':
      case 'wallet':
      default:
        docs = await mongoose.models['currency'].find({});
        mapped = await this.map<CurrencyProfile>(docs, amount, 'pocket');
        embed.setTitle(`Top ${amount} Pockets`);
        break;
    }

    embed.setDescription(mapped.join('\n')).setColor('RANDOM');
    return { embed };
  }
}
