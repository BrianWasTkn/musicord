export type CurrencyType = {
  [k: string]: string | number;
};

export const currencyConfig: CurrencyType = {
  maxInventory: 1000,
  maxPocket: 25000000,
  maxMulti: 250,
  minBet: 50,
	maxBet: 750000,
  maxWin: 4444444,
};
