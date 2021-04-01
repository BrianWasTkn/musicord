export class Effects {
  blackjackWinnings: number; // bj winnings
  slotJackpotOdds: number; // jackpot odds
  gambleWinnings: number; // gamble winnigns
  shopDiscount: number; // understandable
  gambleDice: number; // dice roll
  pocketCap: number; // understandable

  constructor(
    data: Partial<{
      bjWngs: Effects['blackjackWinnings'];
      gWngs: Effects['gambleWinnings'];
      sOdds: Effects['slotJackpotOdds'];
      dcnt: Effects['shopDiscount'];
      pCap: Effects['pocketCap'];
      dice: Effects['gambleDice'];
    }> = {}
  ) {
    this.blackjackWinnings = data.bjWngs || 0;
    this.slotJackpotOdds = data.sOdds || 0;
    this.gambleWinnings = data.gWngs || 0;
    this.shopDiscount = data.dcnt || 0;
    this.gambleDice = data.dice || 0;
    this.pocketCap = data.pCap || 0;
  }

  addBlackjackWinnings(amt: number): this {
    this.blackjackWinnings += amt;
    return this;
  }

  addGambleWinnings(winnings: number): this {
    this.gambleWinnings += winnings;
    return this;
  }

  addShopDiscount(discount: number): this {
    this.shopDiscount += discount;
    return this;
  }

  addPocketCap(cap: number): this {
    this.pocketCap += cap;
    return this;
  }

  addSlotJackpotOdd(amount: number): this {
    this.slotJackpotOdds += amount;
    return this;
  }

  addDiceRoll(amount: number): this {
    this.gambleDice += amount;
    return this;
  }
}
