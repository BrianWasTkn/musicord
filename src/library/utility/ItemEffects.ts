/**
 * Our helper class for all item effects. 
 * @author BrianWasTaken
*/

export class ItemEffects {
	public blackjackWinnings: number = 0;
	public slotJackpotOdds: number = 0;
	public gambleWinnings: number = 0;
	public shopDiscount: number = 0;
	public gambleDice: number = 0;
	public pocketCap: number = 0;
	public vaultCap: number = 0;
	public spaceCap: number = 0;

	/**
	 * Again this is not jaba.
	 */
	public static createInstance() {
		return new this();
	}

	/**
	 * Increase winnings.
	 */
	public addWinnings(type: 'bj' | 'gamble', amount: number) {
		switch(type) {
			case 'bj':
				this.blackjackWinnings += amount;
				return this;
			case 'gamble':
				this.gambleWinnings += amount;
				return this;
			default: // just in case typescript fucks up
				return this;
		}
	}

	/**
	 * Add odds to win on slots/gamble.
	 */
	public addOdds(type: 'slots' | 'gamble', amount: number) {
		switch(type) {
			case 'slots':
				this.slotJackpotOdds += amount;
				return this;
			case 'gamble':
				this.gambleDice += amount;
				return this;
			default:
				return this;
		}
	}

	/**
	 * Add a shop discount whenever someone buys an item.
	  */
	public addDiscount(amount: number) {
		this.shopDiscount += amount;
		return this;
	}

	/**
	 * Set the balance caps into something.
	 */
	public setCap(type: 'pocket' | 'vault' | 'space', amount: number) {
		switch(type) {
			case 'pocket':
				this.pocketCap = amount;
				return this;
			case 'vault':
				this.vaultCap = amount;
				return this;
			case 'space':
				this.spaceCap = amount;
				return this;
			default:
				return this;
		}
	}
}