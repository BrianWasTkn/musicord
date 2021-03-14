export type CurrencyType = {
  [k: string]: string | number;
};

export const currencyConfig: CurrencyType = {
  maxInventory: 1000,
  maxPocket: 50000000,
  maxMulti: 250,
  minBet: 100,
	maxBet: 500000,
  maxWin: 2222222,
};
