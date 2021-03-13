export type CurrencyType = {
  [k: string]: string | number;
};

export const currencyConfig: CurrencyType = {
  maxInventory: 100,
  maxPocket: 25000000,
  maxMulti: 250,
  minBet: 50,
	maxBet: 750000,
  maxWin: 3333333,
};
