import { CurrencyProfile } from '@lib/interface/mongo/currency';
import { UserPlus } from './user';
import { Lava } from '@lib/Lava';
import {
  APIMessageContentResolvable,
  StringResolvable,
  MessageAdditions,
  MessageOptions,
  MessageEmbed,
  NewsChannel,
  TextChannel,
  APIMessage,
  Structures,
  DMChannel,
  Message,
} from 'discord.js';

type MessageChannel = DMChannel | TextChannel | NewsChannel;

export class MessagePlus extends Message {
  author: UserPlus;
  client: Lava;

  constructor(client: Lava, data: object, channel: MessageChannel) {
    super(client, data, channel);
  }

  async calcSpace() {
    const { maxSafeSpace } = this.client.config.currency;
    const { randomNumber } = this.client.util;
    const { fetch, add } = this.client.db.currency;

    const o = await fetch(this.author.id);
    if (o.space >= maxSafeSpace) {
      o.space = maxSafeSpace;
      return { msg: this, d: await o.save() };
    }

    const gain = Math.round(55 * (randomNumber(1, 100) / 2) + 55);
    return { msg: this, d: await add(this.author.id, 'space', gain) };
  }

  fetchDB(id: string) {
    return this.client.db.currency.fetch(id);
  }

  dbAdd(id: string, key: keyof CurrencyProfile, amount: number) {
    return this.client.db.currency.add(id, key, amount);
  }

  dbRemove(id: string, key: keyof CurrencyProfile, amount: number) {
    return this.client.db.currency.remove(id, key, amount);
  }

  embed(data: MessageEmbed): Promise<Message> {
    const embed = data instanceof MessageEmbed ? data : new MessageEmbed(data);
    return this.channel.send({ embed });
  }

}

Structures.extend('Message', () => MessagePlus);
