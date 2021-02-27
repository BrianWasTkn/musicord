export type CurrencyType = {
  [k: string]: string | number;
};

export const currencyConfig: CurrencyType = {
  maxInventory: 100,
  maxPocket: 20000000,
  maxMulti: 120,
  minBet: 50,
  maxBet: 500000,
  maxWin: 2222222,
};
