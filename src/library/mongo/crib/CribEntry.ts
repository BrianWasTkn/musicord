/**
 * User Entry to manage their bot stuff.
 * @author BrianWasTaken
*/

import { UserSetting, UserEntry } from 'lava/mongo';
import { GiveawayDonation } from '.';
import { Collection } from 'discord.js';

export class CribEntry extends UserEntry<CribProfile> {
	get booster() {
    return this.data.booster;
  }

  get dono() {
    return this.data.donations.reduce((coll, slot) => 
      coll.set(slot.id, new GiveawayDonation(this.client, slot)), 
      new Collection<string, GiveawayDonation>()
    );
  }
}