/**
 * Our helper class for all item effects. 
 * @author BrianWasTaken
*/

export class ItemEffects {
	public payouts = 0;
	public xpBoost = 0;
	public keyDrop = 0;
	public multi = 0;
	public slots = 0;
	public luck = 0;
	public dice = 0;

	/**
	 * Again this is not jaba.
	 */
	public static createInstance() {
		return new this();
	}

	public setPayouts(amount: number) {
		this.payouts = amount;
		return this;
	}

	public setXPBoost(amount: number) {
		this.xpBoost = amount;
		return this;
	}

	public setMulti(amount: number) {
		this.multi = amount;
		return this;
	}

	public setLuck(type: 'slots' | 'dice' | 'keyDrop' | 'def', amount: number) {
		switch(type) {
			case 'slots':
				this.slots = amount;
				return this;
			case 'dice': 
				this.dice = amount;
				return this;
			case 'keyDrop':
				this.keyDrop = amount;
				return this;
			default: 
				this.luck = amount;
				return this;
		}
	}
}