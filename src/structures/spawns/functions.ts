import { Snowflake, User } from 'discord.js'
import Lava from 'discord-akairo'
import Spawn from './model'

const dbSpawn = (client: Lava.Client) => ({
	create: async (
		userID: Snowflake
	): Promise<boolean | any> => {
		const user: User = client.users.cache.get(userID);
		if (!user || user.bot) return false;
		const data = new Spawn({ userID: user.id });
		await data.save();
		return data;
	},

	fetch: async (
		userID: Snowflake
	): Promise<any> => {
		const data = await Spawn.findOne({ userID });
		if (!data) {
			const newDat = await dbSpawn(client).create(userID);
			return newDat;
		} else {
			return data;
		}
	},

	addUnpaid: async (
		userID: Snowflake, 
		amount: number,
	): Promise<any> => {
		const data = await dbSpawn(client).fetch(userID);
		data.unpaid += amount;
		await data.save();
		return data;
	},
	removeUnpaid: async (
		userID: Snowflake, 
		amount: number,
	): Promise<any> => {
		const data = await dbSpawn(client).fetch(userID);
		data.unpaid -= amount;
		await data.save();
		return data;
	},

	incrementJoinedEvents: async (
		userID: Snowflake, 
		amount?: number,
	): Promise<any> => {
		const data = await dbSpawn(client).fetch(userID);
		data.eventsJoined += amount || 1;
		await data.save();
		return data;
	},
	decrementJoinedEvents: async (
		userID: Snowflake, 
		amount?: number,
	): Promise<any> => {
		const data = await dbSpawn(client).fetch(userID);
		data.eventsJoined -= amount || 1;
		await data.save();
		return data;
	}
});

export default dbSpawn;