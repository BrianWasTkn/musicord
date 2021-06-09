/**
 * User Entry to manage their bot stuff.
 * @author BrianWasTaken
*/

import { Cooldown, UserSetting, UserEntry, CribDonation } from 'lava/index';
import { Collection } from 'discord.js';

export class CribEntry extends UserEntry<CribProfile> {
	get booster() {
    return this.data.booster;
  }

  get dono() {
    return this.data.donations.reduce((coll, slot) => 
      coll.set(slot.id, new CribDonation(this.client, slot)), 
      new Collection<string, CribDonation>()
    );
  }
}