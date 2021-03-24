import { Structures, User, Collection } from 'discord.js';
import { CurrencyProfile } from '@lib/interface/mongo/currency';
import { Effects } from '@lib/utility/effects'
import { Lava } from '@lib/Lava';

export class UserPlus extends User {
  client: Lava;

  constructor(client: Lava, data: object) {
    super(client, data);
  }

  async updateItems() {
    const { effects } = this.client.util;
    const data = await this.fetchDB();
    const items = this.client.handlers.item.modules.array();
    const eff = new Effects();

    for (const item of items) {
      const inv = data.items.find(i => i.id === item.id);
      if (inv.expire > Date.now()) {
        if (item.id === 'brian') 
          eff.setWinnings(0.5).setSlotOdds(5);
        if (item.id === 'thicc') 
          eff.setWinnings(0.5);
        if (item.id === 'thicm')
          eff.addBjWinnings(0.5);
        if (item.id === 'crazy') 
          eff.setSlotOdds(5);

        const temp = new Collection<string, Effects>();
        temp.set(item.id, new Effects());
        if (!effects.has(this.id)) effects.set(this.id, temp);
        effects.get(this.id).set(item.id, eff);
      } else {
        const useref = effects.get(this.id) ;
        if (!useref || useref.has(item.id)) {
          const meh = new Collection<string, Effects>();
          meh.set(item.id, new Effects());
          effects.set(this.id, meh)
        }
      }
    }
  }

  fetchDB() {
    return this.client.db.currency.fetch(this.id);
  }

  dbAdd(key: keyof CurrencyProfile, amount: number) {
    return this.client.db.currency.add(this.id, key, amount);
  }

  dbRemove(key: keyof CurrencyProfile, amount: number) {
    return this.client.db.currency.remove(this.id, key, amount);
  }

  toPing() {
    return super.toString();
  }

  toString() {
    return `${this.username}#${this.discriminator}`;
  }
}

Structures.extend('User', () => UserPlus);
