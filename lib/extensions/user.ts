import { Structures, User, Collection } from 'discord.js';
import { CurrencyProfile } from '@lib/interface/mongo/currency';
import { Document } from 'mongoose';
import { Effects } from '@lib/utility/effects';
import { Lava } from '@lib/Lava';

export class UserPlus extends User {
  client: Lava;
  db: Document & CurrencyProfile;

  constructor(client: Lava, data: object) {
    super(client, data);
  }

  get isBotOwner() {
    return this.client.isOwner(this.id);
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
        switch(inv.id) {
          case 'brian':
            eff.addSlotJackpotOdd(5);
            break;
          case 'crazy':
            eff.addSlotJackpotOdd(5);
            break;
          case 'thicc':
            eff.addGambleWinnings(0.5);
            break;
          case 'thicm':
            eff.addBlackjackWinnings(0.5);
            break;
          case 'dragon': 
            if (Math.random() < 0.1 && inv.amount >= 1) inv.amount--;
            else eff.addDiceRoll(1);
            break;
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
