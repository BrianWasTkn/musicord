import { CurrencyProfile } from '@lib/interface/mongo/currency';
import { Collection } from 'discord.js';
import { MemberPlus } from './member';
import { UserPlus } from './user';
import { Document } from 'mongoose';
import { Command } from '@lib/handlers/command';
import { Effects } from '@lib/utility/effects';
import { Lava } from '@lib/Lava';
import {
  MessageEmbedOptions,
  TextBasedChannel,
  MessageOptions,
  GuildChannel,
  MessageEmbed,
  NewsChannel,
  TextChannel,
  GuildMember,
  Structures,
  DMChannel,
  Message,
  Channel,
  Base,
} from 'discord.js';

type TextableChannel = DMChannel | TextChannel | NewsChannel;
type Constructor = [Lava, object, TextableChannel];

export class Context<Args extends {} = {}> extends Message {
  public channel: TextableChannel;
  public db: ContextDatabase;
  public member: MemberPlus;
  public command: Command;
  public author: UserPlus;
  public client: Lava;
  public args: Args;

  public constructor(...args: Constructor) {
    super(...args);
    this.command = null;
    this.args = Object.create(null);
  }

  addCooldown(cmd: Command): this {
    return this; // for now
  }

  send(args: MessageOptions): Promise<this> {
    return this.channel.send.call(this.channel, args);
  }

  embed(embed?: MessageEmbedOptions): Promise<this> {
    return this.channel.send.call(this.channel, { embed });
  }

  fetchMember(id: string = null, force = false, limit?: number) {
    return this.guild.members.fetch({
      user: id != null ? id : this.member.user.id,
      force,
      limit,
    });
  }

  fetchMessage(id: string = null, cache = false, force = false) {
    return this.channel.messages.fetch(id != null ? id : this.id);
  }

  toString(isSuper = false) {
    return isSuper
      ? super.toString()
      : `[${this.constructor.name}] ${this.content || this.id}`;
  }
}

export class ContextDatabase extends Base {
  public data: Document & CurrencyProfile;
  public ctx: Context;
  public client: Lava;

  public constructor(ctx: Context) {
    super(ctx.client);
    this.ctx = ctx;
    this.data = null;
  }

  private async init(id: string): Promise<this> {
    const { fetch } = this.ctx.client.db.currency;
    this.data = await fetch(id);
    return this;
  }

  fetch(id = this.ctx.author.id) {
    return this.init(id);
  }

  addPocket(amount: number): this {
    if (!this.data) this._reportError();
    this.data.pocket += amount;
    return this;
  }

  removePocket(amount: number): this {
    if (!this.data) this._reportError();
    this.data.pocket -= amount;
    return this;
  }

  deposit(amount: number) {
    if (!this.data) this._reportError();
    this.data.pocket -= amount;
    this.data.vault += amount;
    return this;
  }

  withdraw(amount: number) {
    if (!this.data) this._reportError();
    this.data.pocket += amount;
    this.data.vault -= amount;
    return this;
  }

  calcSpace(offset: number = 55, boost: number = 1, limit: number = 1000e6) {
    const randomNumber = (a: number, b: number) =>
      Math.floor(Math.random() * (b - a + 1) + a);
    const calc = (boosty: number) => Math.round(offset * (boosty / 2) + offset);
    this.data.space = Math.min(calc(boost), limit);
    return this;
  }

  updateItems() {
    const { effects } = this.client.util;
    const items = this.client.handlers.item.modules.array();
    const eff = new Effects();

    for (const item of items) {
      const inv = this.data.items.find((i) => i.id === item.id);
      if (inv.expire > Date.now()) {
        const trigger = {
          brian: () => eff.addSlotJackpotOdd(5),
          crazy: () => eff.addSlotJackpotOdd(5),
          thicc: () => eff.addGambleWinnings(0.5),
          thicm: () => eff.addBlackjackWinnings(0.5),
          dragon: () => eff.addDiceRoll(1),
        };

        if (['dragon'].includes(inv.id)) {
          if (inv.amount >= 1) {
            trigger[inv.id]();
            if (Math.random() < 1) {
              inv.amount--;
            }
          }
        } else {
          const includes = ['brian', 'crazy', 'thicc', 'thicm'].includes(
            inv.id
          );
          if (includes) {
            trigger[inv.id]();
          } else {
            continue;
          }
        }

        const temp = new Collection<string, Effects>();
        temp.set(item.id, new Effects());
        if (!effects.has(this.ctx.author.id))
          effects.set(this.ctx.author.id, temp);
        effects.get(this.ctx.author.id).set(item.id, eff);
      } else {
        const useref = effects.get(this.ctx.author.id);
        if (!useref || useref.has(item.id)) {
          const meh = new Collection<string, Effects>();
          meh.set(item.id, new Effects());
          effects.set(this.ctx.author.id, meh);
        }
      }
    }

    return this;
  }

  save(): Promise<Document & CurrencyProfile> {
    if (!this.data) this._reportError();
    return this.data.save();
  }

  _reportError() {
    throw new Error(`[${this.toString()}] property "db" hasn't been assigned.`);
  }

  toString() {
    return `[${this.constructor.name}]`;
  }
}

export default () => {
  return Structures.extend('Message', () => Context);
};
