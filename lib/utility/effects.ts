export class Effects {
	winnings: number;
	discount: number;
	pockCap: number;
	slots: number;
	dice: number;

	constructor(data?: {
		winnings: Effects["winnings"],
		discount: Effects["discount"],
		pockCap: Effects["pockCap"],
		slots: Effects["slots"],
		dice: Effects["dice"],
	}) {

		if ('winnings' in data) {
			this.winnings = data.winnings;
		}
		if ('discount' in data) {
			this.discount = data.discount;
		}
		if ('pockCap' in data) {
			this.pockCap = data.pockCap;
		}
		if ('slots' in data) {
			this.slots = data.slots;
		}
		if ('dice' in data) {
			this.dice = data.dice;
		}
	}

	setWinnings(winnings: number): this {
		this.winnings = winnings;
		return this;
	}

	setDiscount(discount: number): this {
		this.discount = discount;
		return this;
	}

	setPockCap(cap: number): this {
		this.pockCap = cap;
		return this;
	}

	setSlotLength(emojis: string[], length: number): this {
		this.slots = emojis.length = length;
		return this;
	}

	setAddDice(amount: number): this {
		this.dice = amount;
		return this;
	}
}