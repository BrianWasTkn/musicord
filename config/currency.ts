export type CurrencyType = {
  [k: string]: string | number;
};

export const currencyConfig: CurrencyType = {
	maxSafePocket: 1000000000,
  maxInventory: 100000,
  maxPocket: 75000000,
  maxMulti: 250,
  minBet: 100,
  maxBet: 750000,
  maxWin: 6500001,
};
