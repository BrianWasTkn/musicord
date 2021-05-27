/**
 * User Entry to manage their bot stuff.
 * @author BrianWasTaken
*/

import { LavaCooldown, LavaSetting } from '../..';
import { Collection } from 'discord.js';
import { UserEntry } from '..';

export class LavaEntry extends UserEntry<LavaProfile> {
    get cooldowns() {
        return this.data.cooldowns.reduce((col, cd) => col.set(cd.id, new LavaCooldown(this.client, cd)) , new Collection<string, LavaCooldown>());
    }

    get settings() {
        return this.data.settings.reduce((col, s) => col.set(s.id, new LavaSetting(this.client, s)) , new Collection<string, LavaSetting>());
    }
}