import { Structures, User, Collection } from 'discord.js';
import { CurrencyProfile } from '@lib/interface/mongo/currency';
import { Document } from 'mongoose';
import { Effects } from '@lib/utility/effects';
import { Lava } from '@lib/Lava';

export class UserPlus extends User {
  db: Document & CurrencyProfile;
  client: Lava;

  constructor(client: Lava, data: object) {
    super(client, data);
  }

  get isBlacklisted() {
    return !!this.db.bled;
  }

  get isBotOwner() {
    return this.client.isOwner(this.id);
  }

  async fetchData() {
    const { fetch } = this.client.db.currency;
    this.db = await fetch(this.id);
    return this;
  }

  initDB(data: Document & CurrencyProfile) {
    this.db = data;
    return this;
  }

  updateItems() {
    const { effects } = this.client.util;
    const items = this.client.handlers.item.modules.array();
    const eff = new Effects();

    for (const item of items) {
      const inv = this.db.items.find((i) => i.id === item.id);
      if (inv.expire > Date.now()) {
        const trigger = {
          'brian': () => eff.addSlotJackpotOdd(5),
          'crazy': () => eff.addSlotJackpotOdd(5),
          'thicc': () => eff.addGambleWinnings(0.5),
          'thicm': () => eff.addBlackjackWinnings(0.5),
          'dragon': () => eff.addDiceRoll(1)
        };

        if (['dragon'].includes(inv.id)) {
          if (inv.amount >= 1) {
            trigger[inv.id]();
            if (Math.random() < 1) {
              inv.amount--;
            }
          }
        } else {
          const includes = ['brian', 'crazy', 'thicc', 'thicm'].includes(inv.id);
          if (includes) trigger[inv.id]();
          else continue;
        }        

        const temp = new Collection<string, Effects>();
        temp.set(item.id, new Effects());
        if (!effects.has(this.id)) effects.set(this.id, temp);
        effects.get(this.id).set(item.id, eff);
      } else {
        const useref = effects.get(this.id);
        if (!useref || useref.has(item.id)) {
          const meh = new Collection<string, Effects>();
          meh.set(item.id, new Effects());
          effects.set(this.id, meh);
        }
      }
    }

    return this;
  }

  calcSpace() {
    const { maxSafeSpace } = this.client.config.currency;
    const { util } = this.client;

    if (this.db.space >= maxSafeSpace) {
      this.db.space = maxSafeSpace;
      return this;
    }

    const gain = Math.round(55 * (util.randomNumber(1, 1000) / 2) + 55);
    this.db.space += gain;
    return this;
  }

  blacklist() {
    this.db.bled = true;
    return this;
  }

  unblacklist() {
    this.db.bled = false;
    return this;
  }

  addPocket(amount: number) {
    this.db.pocket += amount;
    return this;
  }

  removePocket(amount: number) {
    this.db.pocket -= amount;
    return this;
  }

  setPocket(amount: number) {
    this.db.pocket = amount;
    return this;
  }

  deposit(amount: number) {
    this.db.vault += amount;
    this.db.pocket -= amount;
    return this;
  }

  withdraw(amount: number) {
    this.db.vault -= amount;
    this.db.pocket += amount;
    return this;
  }

  fetchDB() {
    return this.client.db.currency.fetch(this.id);
  }
}

Structures.extend('User', () => UserPlus);
