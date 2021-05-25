/**
 * User Entry to manage their spawn datatards.
 * @author BrianWasTaken
*/

import { UserEntry } from '..';

export class SpawnEntry extends UserEntry<SpawnData> {
	/**
	 * Basic props.
	*/
	get props() {
		return this.data.props;
	}

	/**
	 * Manage their unpaids.
	*/
	balance(amount: number) {
		return {
			add: () => {
				this.data.props.balance += amount;
				return this;
			},
			remove: () => {
				this.data.props.balance -= amount;
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
				this.data.props.joined_events += inc;
				return this;
			},
			decrement: () => {
				this.data.props.joined_events -= inc;
				return this
			}
		}
	}
}