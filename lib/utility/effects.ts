export class Effects {
  bjWinnings: number; // bj winnings
  winnings: number; // gamble winnigns
  discount: number; // understandable
  pockCap: number; // understandable
  slots: number; // jackpot odds
  dice: number; // dice roll

  constructor(
    data: Partial<{
      bjWinnings: Effects['bjWinnings'];
      winnings: Effects['winnings'];
      discount: Effects['discount'];
      pockCap: Effects['pockCap'];
      slots: Effects['slots'];
      dice: Effects['dice'];
    }> = {}
  ) {
    this.bjWinnings = data.bjWinnings || 0;
    this.winnings = data.winnings || 0;
    this.discount = data.discount || 0;
    this.pockCap = data.pockCap || 0;
    this.slots = data.slots || 0;
    this.dice = data.dice || 0;
  }

  addBjWinnings(amt: number): this {
    this.bjWinnings += amt;
    return this;
  }

  setWinnings(winnings: number): this {
    this.winnings += winnings;
    return this;
  }

  setDiscount(discount: number): this {
    this.discount += discount;
    return this;
  }

  setPockCap(cap: number): this {
    this.pockCap += cap;
    return this;
  }

  setSlotOdds(amount: number): this {
    this.slots += amount;
    return this;
  }

  setAddDice(amount: number): this {
    this.dice += amount;
    return this;
  }
}
