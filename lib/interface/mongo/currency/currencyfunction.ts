import { CurrencyProfile } from './currencyprofile';
import { CurrencyUtil } from './currencyutil';
import { Snowflake } from 'discord.js';
import { Document } from 'mongoose';

export interface CurrencyFunction {
  util: CurrencyUtil;
  create: (userID: Snowflake) => Promise<Document<CurrencyProfile>>;
  fetch: (userID: Snowflake) => Promise<Document & CurrencyProfile>;
  addPocket: (
    userID: Snowflake,
    amount: number
  ) => Promise<Document & CurrencyProfile>;
  removePocket: (
    userID: Snowflake,
    amount: number
  ) => Promise<Document & CurrencyProfile>;
  addVault: (
    userID: Snowflake,
    amount: number
  ) => Promise<Document & CurrencyProfile>;
  removeVault: (
    userID: Snowflake,
    amount: number
  ) => Promise<Document & CurrencyProfile>;
  addSpace: (
    userID: Snowflake,
    amount: number
  ) => Promise<Document & CurrencyProfile>;
  removeSpace: (
    userID: Snowflake,
    amount: number
  ) => Promise<Document & CurrencyProfile>;
  addMulti: (
    userID: Snowflake,
    amount: number
  ) => Promise<Document & CurrencyProfile>;
  removeMulti: (
    userID: Snowflake,
    amount: number
  ) => Promise<Document & CurrencyProfile>;
}
