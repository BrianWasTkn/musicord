/**
 * User Entry to manage their spawn datatards.
 * @author BrianWasTaken
*/

import { UserEntry, SpawnEndpoint } from 'lava/mongo';

export declare interface SpawnEntry extends UserEntry<SpawnProfile> {
  /** The endpoint of this entry. */
  endpoint: SpawnEndpoint;
} 

export class SpawnEntry extends UserEntry<SpawnProfile> {
	/**
	 * Basic props.
	*/
	get props() {
		return this.data;
	}

	/**
	 * Manage their unpaids.
	*/
	private balance(amount: number) {
		return {
			add: () => {
				this.data.unpaids += amount;
				return this;
			},
			remove: () => {
				this.data.unpaids -= amount;
				return this;
			}
		}
	}

	/**
	 * Manage their joined events.
	*/
	private joined(inc = 1) {
		return {
			increment: () => {
				this.data.joined += inc;
				return this;
			},
			decrement: () => {
				this.data.joined -= inc;
				return this
			}
		}
	}
}