import { Collection, CollectorFilter, MessageCollectorOptions } from 'discord.js';
import { MemberPlus, UserPlus } from '.';
import { Document } from 'mongoose';
import { Command } from 'lib/handlers/command';
import { Effects } from 'lib/utility/effects';
import { Lava } from 'lib/Lava';
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
import config from 'config/index';

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

  awaitMessage(user = this.author.id, time = 3e4): Promise<Collection<string, this>> {
    const options: MessageCollectorOptions = { max: 1, time };
    const filter: CollectorFilter<[this]> = ({ author }) => user === author.id;
    return this.channel.awaitMessages.call(this.channel, filter, options);
  }

  toString() {
    return super.toString();
  }
}

export class ContextDatabase extends Base {
  public data: CurrencyProfile;
  public ctx: Context;
  public client: Lava;

  public constructor(ctx: Context) {
    super(ctx.client);
    this.ctx = ctx;
    this.data = null;
  }

  private async init(id: string, assign: boolean): Promise<this> {
    const { fetch } = this.ctx.client.db.currency;
    let data: CurrencyProfile;
    data = await fetch(id);
    if (assign) this.data = data;
    const temp = new ContextDB(this.ctx);
    temp.data = data;
    return assign ? this : temp as this;
  }

  fetch(id = this.ctx.author.id, assign = true) {
    return this.init(id, assign);
  }

  addCd(cmd = this.ctx.command) {
    if (!this.data) this._reportError();
    const { cooldowns: cds } = this.data;
    const expire = this.ctx.createdTimestamp + cmd.cooldown;
    const cd = cds.find(c => c.id === cmd.id);
    if (!cd) cds.push({ expire, uses: 0, id: cmd.id });
    else cd.expire = expire;
    return this;
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

  beingHeisted(bool = true) {
    if (!this.data) this._reportError();
    this.data.misc.beingHeisted = bool;
    return this;
  }

  calcSpace(offset: number = 55, boost: number = 1, limit: number = config.currency.maxSafeSpace) {
    if (!this.data) this._reportError();
    const calc = (boosty: number) => Math.round(offset * (boosty / 2) + offset);
    this.data.space = Math.min(this.data.space + calc(boost), limit);
    return this;
  }

  recordDailyStreak() {
    if (!this.data) this._reportError();
    this.data.daily.time = Date.now();
    return this;
  }

  addDailyStreak() {
    if (!this.data) this._reportError();
    this.data.daily.streak++;
    return this;
  }

  resetDailyStreak() {
    if (!this.data) this._reportError();
    this.data.daily.streak = 1;
    return this;
  }

  updateStats(key: keyof Stats, amount = 1) {
    if (!this.data) this._reportError();
    this.data.stats[key] += amount;
    return this;
  }

  addInv(item: string, amount = 1) {
    if (!this.data) this._reportError();
    const module = this.client.handlers.item.modules.get(item);
    const inv = module.findInv(this.data.items, module);
    inv.amount += amount;
    return this;
  }

  removeInv(item: string, amount = 1) {
    if (!this.data) this._reportError();
    const module = this.client.handlers.item.modules.get(item);
    const inv = module.findInv(this.data.items, module);
    inv.amount -= amount;
    return this;
  }

  updateItems() {
    const { util: { effects }, handlers: { item: handler } } = this.client;
    const items = [...handler.modules.values()];
    const call = () => new Effects();
    const eff = call();

    for (const item of items) {
      const inv = item.findInv(this.data.items, item);
      const trigger = {
        brian: () => eff.addSlotJackpotOdd(5),
        crazy: () => eff.addSlotJackpotOdd(5),
        thicc: () => eff.addGambleWinnings(0.5),
        thicm: () => eff.addBlackjackWinnings(0.5),
        trophy: () => eff.addGambleWinnings(0.5),
        dragon: () => eff.addDiceRoll(1)
          .addBlackjackWinnings(1)
          .addGambleWinnings(1),
      };

      if (item.checks.includes('activeState') && inv.active) {
        if (trigger[item.id]) trigger[item.id](); 
        if (Math.random() < 0.1) inv.amount--;
      } else if (item.checks.includes('time') && inv.expire > Date.now()) {
        if (trigger[item.id]) trigger[item.id](); 
      } else { continue; }

      const temp = new Collection<string, Effects>();
      const { id } = this.ctx.author;
      if (effects.has(id)) {
        temp.set(item.id, call());
        effects.get(id).set(item.id, eff);
      } else {
        const useref = effects.get(id);
        if (!useref || useref.has(item.id)) {
          const meh = new Collection<string, Effects>();
          meh.set(item.id, call());
          effects.set(id, meh);
        }
      }
    }

    return this;
  }

  save(): Promise<Document & CurrencyProfile> {
    if (!this.data) this._reportError();
    return this.data.save();
  }

  private _reportError() {
    throw new Error(`[${this.toString()}] property "db" hasn't been assigned.`);
  }

  toString() {
    return `[${this.constructor.name}]`;
  }
}

// Circular 
const ContextDB = ContextDatabase;

export default () => Structures.extend('Message', () => Context);