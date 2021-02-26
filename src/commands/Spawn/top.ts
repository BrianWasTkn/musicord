import { Message, MessageEmbed } from 'discord.js';
import { Command } from 'discord-akairo';
import mongoose from 'mongoose';

export default class Spawn extends Command {
  public client: Akairo.Client;

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

  private async map<T extends Lava.CurrencyProfile | Lava.SpawnDocument>(
    docs: (mongoose.Document & T)[],
    amount: number,
    key: string
  ): Promise<Promise<string>[]> {
    let all = docs
      .filter((m: mongoose.Document & T) => m[key] < Infinity)
      .sort(
        (a: mongoose.Document & T, b: mongoose.Document & T) => b[key] - a[key]
      )
      .slice(0, amount);

    return all.map(async (m: mongoose.Document & T, i: number) => {
      const user = await this.client.users.fetch(m.userID);
      return <string>`${i + 1}. **${m[key].toLocaleString()}** - ${user.tag}`;
    });
  }

  async exec(_: Message, args: any): Promise<Message> {
    let { type, amount } = args;
    type = type || 'unpaids';
    amount = amount || 10;

    let embed = new MessageEmbed();
    let docs: any[];
    let mapped: Promise<string>[];

    if (['unpaid', 'unpaids', 'spawns', 'spawn'].includes(type)) {
      docs = await mongoose.models['spawn-profile'].find({});
      mapped = await this.map<Lava.SpawnDocument>(docs, amount, 'unpaid');
      embed.setTitle('Top Unpaids');
    } else if (['pocket', 'wallet'].includes(type)) {
      docs = await mongoose.models['currency'].find({});
      mapped = await this.map<Lava.SpawnDocument>(docs, amount, 'pocket');
      embed.setTitle('Top Pockets');
    }

    embed
      .setDescription((await Promise.all(mapped)).join('\n'))
      .setColor('RANDOM');
    return _.channel.send({ embed });
  }
}
