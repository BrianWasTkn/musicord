/**
 * User Entry to manage their spawn datatards.
 * @author BrianWasTaken
*/

import { UserEntry } from '..';

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
	balance(amount: number) {
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
	joined(inc = 1) {
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