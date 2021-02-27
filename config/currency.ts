export type CurrencyType = {
  [k: string]: string | number;
};

export const currencyConfig: CurrencyType = {
  maxInventory: 10,
  maxPocket: Infinity,
  maxMulti: 120,
  minBet: 50,
  maxBet: 500000,
  maxWin: 2222222,
};
