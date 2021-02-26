import { Snowflake, User } from 'discord.js';
import { Document } from 'mongoose';
import { utils } from './util';
import Currency from './model';

/**
 * Callable functions for our currency plugin.
 * @param client An extended instance of AkairoClient
 */
export default function dbCurrency(
  client: Akairo.Client
): Lava.CurrencyFunction {
  return {
    util: utils,

    /**
     * create a new document in db
     * @param userID the user id
     */
    create: async (
      userID: Snowflake
    ): Promise<Document<Lava.CurrencyProfile>> => {
      const user: User = await client.users.fetch(userID);
      const data: Document<Lava.CurrencyProfile> = new Currency({
        userID: user.id,
      });
      await data.save();
      return data;
    },

    /**
     * Fetch the user's data from mongodb
     * @param userID A Discord User ID
     */
    fetch: async (
      userID: Snowflake
    ): Promise<Document & Lava.CurrencyProfile> => {
      const data = await Currency.findOne({ userID });
      if (!data) {
        const newDat = await dbCurrency(client).create(userID);
        return newDat as Document & Lava.CurrencyProfile;
      } else {
        return data as Document & Lava.CurrencyProfile;
      }
    },

    /**
     * Add an amount to user's pocket
     * @param userID A Discord User ID
     * @param amount the amount to be added
     */
    addPocket: async (
      userID: Snowflake,
      amount: number
    ): Promise<Document & Lava.CurrencyProfile> => {
      const data: Document & Lava.CurrencyProfile = await dbCurrency(
        client
      ).fetch(userID);
      data.pocket += amount;
      await data.save();
      return data;
    },
    /**
     * Remove an amount to user's pocket
     * @param userID A Discord User ID
     * @param amount the amount to be deducted
     */
    removePocket: async (
      userID: Snowflake,
      amount: number
    ): Promise<Document & Lava.CurrencyProfile> => {
      const data = await dbCurrency(client).fetch(userID);
      data.pocket -= amount;
      await data.save();
      return data;
    },

    /**
     * add amount to user's vault
     * @param userID user id
     * @param amount amount to be added
     */
    addVault: async (
      userID: Snowflake,
      amount: number
    ): Promise<Document & Lava.CurrencyProfile> => {
      const data = await dbCurrency(client).fetch(userID);
      data.vault += amount;
      await data.save();
      return data;
    },
    /**
     * remov amount to user's vault
     * @param userID user id
     * @param amount amount to be removed
     */
    removeVault: async (
      userID: Snowflake,
      amount: number
    ): Promise<Document & Lava.CurrencyProfile> => {
      const data = await dbCurrency(client).fetch(userID);
      data.vault -= amount;
      await data.save();
      return data;
    },

    /**
     * add something into user's bank space
     * @param userID a user id
     * @param amount the amount to be added
     */
    addSpace: async (
      userID: Snowflake,
      amount: number
    ): Promise<Document & Lava.CurrencyProfile> => {
      const data = await dbCurrency(client).fetch(userID);
      data.space += amount;
      await data.save();
      return data;
    },
    /**
     * remove something into user's bank space
     * @param userID a user id
     * @param amount the amount to be removed
     */
    removeSpace: async (
      userID: Snowflake,
      amount: number
    ): Promise<Document & Lava.CurrencyProfile> => {
      const data = await dbCurrency(client).fetch(userID);
      data.space -= amount;
      await data.save();
      return data;
    },

    /**
     * add multis
     * @param userID a user id
     * @param amount the amount to be added
     */
    addMulti: async (
      userID: Snowflake,
      amount: number
    ): Promise<Document & Lava.CurrencyProfile> => {
      const data = await dbCurrency(client).fetch(userID);
      data.multi += amount;
      await data.save();
      return data;
    },
    /**
     * rem mult
     * @param userID user id - im honestly tired of typing this shityy jsdoc
     * @param amount amt to be dded
     */
    removeMulti: async (
      userID: Snowflake,
      amount: number
    ): Promise<Document & Lava.CurrencyProfile> => {
      const data = await dbCurrency(client).fetch(userID);
      data.multi -= amount;
      await data.save();
      return data;
    },
  };
}
