export type CurrencyType = {
	maxSafePocket: number,
	maxSafeSpace: number,
  maxInventory: number,
  maxPocket: number,
  maxMulti: number,
  minBet: number,
  maxBet: number,
  maxWin: number,
};

export const currencyConfig: CurrencyType = {
	maxSafePocket: 1000000000,
	maxSafeSpace: 100000000000,
  maxInventory: 100000,
  maxPocket: 75000000,
  maxMulti: 250,
  minBet: 100,
  maxBet: 750000,
  maxWin: 6500001,
};
