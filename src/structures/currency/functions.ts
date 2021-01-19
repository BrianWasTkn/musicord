import { Snowflake, User } from 'discord.js'
import { LavaClient } from 'discord-akairo'
import Currency from '../../models/CurrencyProfile'

const dbCurrency = (client: LavaClient) => ({
	create: async (
		userID: Snowflake
	): Promise<boolean | any> => {
		const user: User = client.users.cache.get(userID);
		if (!user || user.bot) return false;
		const data = new Currency({ userID: user.id });
		return data;
	},

	fetch: async (
		userID: Snowflake
	): Promise<any> => {
		const data = await Currency.findOne({ userID });
		if (!data) {
			const newDat = await dbCurrency(client).create(userID);
			return newDat;
		} else {
			return data;
		}
	},

	addPocket: async (
		userID: Snowflake, 
		amount: number,
	): Promise<any> => {
		const data = await dbCurrency(client).fetch(userID);
		data.pocket += amount;
		await data.save();
		return data;
	},
	removePocket: async (
		userID: Snowflake, 
		amount: number,
	): Promise<any> => {
		const data = await dbCurrency(client).fetch(userID);
		data.pocket -= amount;
		await data.save();
		return data;
	},

	addVault: async (
		userID: Snowflake, 
		amount: number,
	): Promise<any> => {
		const data = await dbCurrency(client).fetch(userID);
		data.vault += amount;
		await data.save();
		return data;
	},
	removeVault: async (
		userID: Snowflake, 
		amount: number,
	): Promise<any> => {
		const data = await dbCurrency(client).fetch(userID);
		data.vault -= amount;
		await data.save();
		return data;
	},

	addSpace: async (
		userID: Snowflake, 
		amount: number,
	): Promise<any> => {
		const data = await dbCurrency(client).fetch(userID);
		data.space += amount;
		await data.save();
		return data;
	},
	removeSpace: async (
		userID: Snowflake, 
		amount: number,
	): Promise<any> => {
		const data = await dbCurrency(client).fetch(userID);
		data.space -= amount;
		await data.save();
		return data;
	},

	addMulti: async (
		userID: Snowflake, 
		amount: number,
	): Promise<any> => {
		const data = await dbCurrency(client).fetch(userID);
		data.multi += amount;
		await data.save();
		return data;
	},
	removeMulti: async (
		userID: Snowflake, 
		amount: number,
	): Promise<any> => {
		const data = await dbCurrency(client).fetch(userID);
		data.multi -= amount;
		await data.save();
		return data;
	}
});

export default dbCurrency;