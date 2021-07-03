/**
 * User Entry to manage their bot stuff.
 * @author BrianWasTaken
*/

import { UserSetting, UserEntry } from 'lava/mongo';
import { GiveawayDonation } from '.';
import { Collection } from 'discord.js';

export class CribEntry extends UserEntry<CribProfile> {
  /** Their booster shit */
	get booster() {
    return this.data.booster;
  }

  /** Their donos in memers crib */
  get dono() {
    return super.map('donations', GiveawayDonation);
  }

  /** Manage user donos */
  private donation(id: string, amount: number) {
    const thisDono = this.data.donations.find(d => d.id === id);

    return {
      add: (count: boolean) => {
        if (count) thisDono.count++;
        thisDono.amount += amount;
        return this;
      },
      sub: () => {
        thisDono.amount -= amount;
        return this;
      }
    }
  }

  /** Manage crib boosts */
  private boost() {
    return {
      activate: (expire: number) => {
        this.data.booster.expires = expire;
        return this;
      },
      deactivate: () => {
        this.data.booster.expires = 0;
        this.data.booster.role = '';
        return this;
      },
      setRole: (role: string) => {
        this.data.booster.role = role;
        return this;
      }
    }
  }

  /** Trigger their booster crap */
  triggerBoost(expire = 1000 * 60 * 60 * 24 * 7) {
    return this.boost().activate(expire);
  }

  /** Deactivate their perks. */
  endBoost() {
    return this.boost().deactivate();
  }

  /** Booster custom role */
  setBoostRole(role: string) {
    return this.boost().setRole(role);
  }

  /** Add donos */
  addDono(id: string, amount: number, count = true) {
    return this.donation(id, amount).add(count);
  }

  /** Remove donos */
  remDono(id: string, amount: number) {
    return this.donation(id, amount).sub();
  }
}