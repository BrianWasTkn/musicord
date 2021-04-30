import { Collection, CollectorFilter, MessageCollectorOptions } from 'discord.js';
import { MemberPlus, UserPlus } from '.';
import { Command, Quest } from 'lib/handlers';
import { TargetMethod } from 'lib/interface/handlers/quest';
import { Document } from 'mongoose';
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

  private async init(userID: string, assign: boolean): Promise<this> {
    const { fetch } = this.ctx.client.db.currency;
    let data: CurrencyProfile = await fetch(userID);
    if (assign) this.data = data;
    const temp = new ContextDB(this.ctx);
    temp.data = data;
    return assign ? this : temp as this;
  }

  fetch(id = this.ctx.author.id, assign = true) {
    return this.init(id, assign);
  }

  addCd(cmd = this.ctx.command, time?: number) {
    if (!this.data) this._reportError();
    if (this.client.isOwner(this.ctx.author.id)) return this;
    const { cooldowns: cds } = this.data;
    const expire = this.ctx.createdTimestamp + (typeof time !== 'undefined' ? time: cmd.cooldown);
    const cd = cds.find(c => c.id === cmd.id);
    if (!cd) cds.push({ expire, uses: 0, id: cmd.id });
    if (cd.expire <= this.ctx.createdTimestamp) cd.expire = expire;
    else cd.expire = expire;
    return this;
  }

  addPremiumKeys(amount: number): this {
    if (!this.data) this._reportError();
    this.data.prem += amount;
    return this;
  }

  removePremiumKeys(amount: number): this {
    if (!this.data) this._reportError();
    this.data.prem -= amount;
    return this;
  }

  addPocket(amount: number): this {
    if (!this.data) this._reportError();
    this.data.pocket = Math.round(this.data.pocket + amount);
    return this;
  }

  removePocket(amount: number): this {
    if (!this.data) this._reportError();
    this.data.pocket = Math.round(this.data.pocket - amount);
    return this;
  }

  deposit(amount: number) {
    if (!this.data) this._reportError();
    this.data.pocket = Math.round(this.data.pocket - amount);
    this.data.vault = Math.round(this.data.vault + amount);
    return this;
  }

  withdraw(amount: number) {
    if (!this.data) this._reportError();
    this.data.pocket = Math.round(this.data.pocket + amount);
    this.data.vault = Math.round(this.data.vault - amount);
    return this;
  }

  expandSpace(amount: number) {
    if (!this.data) this._reportError();
    this.data.space += amount;
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
    this.data.space = Math.min(Math.round(this.data.space + calc(boost)), limit);
    this.data.stats.xp++;
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

  startQuest(id: string, args: { type: TargetMethod, target: number }) {
    if (!this.data) this._reportError();
    this.data.quest.id = id;
    this.data.quest.count = 0;
    this.data.quest.type = args.type;
    this.data.quest.target = args.target;
    return this;
  }

  updateQuest(args: Handlers.QuestArgs) {
    if (!this.data) this._reportError();
    const { modules: quests } = this.client.handlers.quest;
    const { quest: aq } = this.data;
    if (!quests.get(aq.id)) return this;

    const mod = quests.get(aq.id);
    if (args.cmd.id !== mod.target[1]) return this;
    // if (aq.type !== mod.target[2]) return this;
    aq.count += args.count;

    if (aq.count >= mod.target[0]) {
      const item = this.client.handlers.item.modules.get(mod.rewards.item[1]);
      const coinR = mod.rewards.coins.toLocaleString();
      const itemR = `${mod.rewards.item[0]} ${item.emoji} ${item.name}`;

      const inv = item.findInv(this.data.items, item);
      this.addInv(item.id, mod.rewards.item[0])
      this.addPocket(mod.rewards.coins);
      this.stopQuest();

      this.client.handlers.quest.emit('done', { ctx: this.ctx, quest: mod, itemR, coinR });
      return this;
    }
    
    return this;
  }

  stopQuest() {
    if (!this.data) this._reportError();
    const report = (m: string) => { throw new Error(m) };
    if (!this.data.quest.id) report(`[${this.toString()}] No active quests.`);
    this.data.quest.id = '';
    this.data.quest.count = 0;
    this.data.quest.type = '' as string;
    this.data.quest.target = 0;
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

  updateInv(id: string, { active, expire, multi }: { 
    active?: boolean, 
    expire?: number, 
    multi?: number 
  }) {
    if (!this.data) this._reportError();
    const item = this.ctx.client.handlers.item.modules.get(id);
    if (!item) return this;
    const find = (i: InventorySlot) => i.id === item.id;
    const inv = this.data.items.find(find);
    if (expire >= 0) inv.expire = expire;
    if (multi >= 0) inv.multi = multi;
    if (active) inv.active = active;
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
        trophy: () => eff.addGambleWinnings(0.5)
          .addBlackjackWinnings(0.5),
        dragon: () => eff.addDiceRoll(1)
          .addBlackjackWinnings(1)
          .addGambleWinnings(1),
      };

      if (item.checks.includes('activeState') && inv.active) {
        if (trigger[item.id]) trigger[item.id](); 
        if (Math.random() < 0.1 && item.id === 'dragon') inv.amount--;
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