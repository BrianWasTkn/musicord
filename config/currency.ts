export type CurrencyType = {
  [k: string]: string | number;
};

export const currencyConfig: CurrencyType = {
	maxSafePocket: 1000000000,
  maxInventory: 100000,
  maxPocket: 50000000,
  maxMulti: 250,
  minBet: 100,
  maxBet: 500000,
  maxWin: 5000001,
};
