export type CurrencyType = {
  maxSafePocket: number;
  maxSafeSpace: number;
  maxInventory: number;
  maxPocket: number;
  maxMulti: number;
  minBet: number;
  maxBet: number;
  maxWin: number;
};

export const currencyConfig: CurrencyType = {
  maxSafePocket: 1000000000,
  maxSafeSpace: 5000000000,
  maxInventory: 100000,
  maxPocket: 10000000,
  maxMulti: 100,
  minBet: 10,
  maxBet: 250000,
  maxWin: 750001,
};
