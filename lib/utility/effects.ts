export class Effects {
	winnings: number;
	discount: number;
	pockCap: number;
	slots: number;
	dice: number;

	constructor(data: Partial<{
		winnings: Effects["winnings"],
		discount: Effects["discount"],
		pockCap: Effects["pockCap"],
		slots: Effects["slots"],
		dice: Effects["dice"],
	}> = {}) {

		this.winnings = data.winnings || 0;
		this.discount = data.discount || 0;
		this.pockCap = data.pockCap || 0;
		this.slots = data.slots || 0;
		this.dice = data.dice || 0;
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