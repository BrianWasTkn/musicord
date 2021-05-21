/**
 * Class helper for active item effects so in short, we're "caching" it.
 * @author BrianWasTaken
*/

import { Collection } from 'discord.js';

interface EffectsConstructor {
	bjWngs: number;
	sOdds: number;
	gWngs: number;
	dcnt: number;
	dice: number;
	pCap: number;
}

export declare interface Effects {
	blackjackWinnings: number;
	slotJackpotOdds: number;
	gambleWinnings: number;
	shopDiscount: number;
	gambleDice: number;
	pocketCap: number;
}

export class Effects {
	public constructor(data: Partial<EffectsConstructor> = {}) {
		this.blackjackWinnings = data.bjWngs || 0;
		this.slotJackpotOdds = data.sOdds || 0;
		this.gambleWinnings = data.gWngs || 0;
		this.shopDiscount = data.dcnt || 0;
		this.gambleDice = data.dice || 0;
		this.pocketCap = data.pCap || 0;
	}

	public addBlackjackWinnings(amt: number): this {
		this.blackjackWinnings += amt;
		return this;
	}

	public addGambleWinnings(winnings: number): this {
		this.gambleWinnings += winnings;
		return this;
	}

	public addShopDiscount(discount: number): this {
		this.shopDiscount += discount;
		return this;
	}

	public addPocketCap(cap: number): this {
		this.pocketCap += cap;
		return this;
	}

	public addSlotJackpotOdd(amount: number): this {
		this.slotJackpotOdds += amount;
		return this;
	}

	public addDiceRoll(amount: number): this {
		this.gambleDice += amount;
		return this;
	}
}

export default Effects;