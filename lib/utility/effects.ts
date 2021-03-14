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

		this.winnings = data.winnings;
		this.discount = data.discount;
		this.pockCap = data.pockCap;
		this.slots = data.slots;
		this.dice = data.dice;
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