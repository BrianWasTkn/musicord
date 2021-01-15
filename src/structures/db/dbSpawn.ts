import { Snowflake, User } from 'discord.js'
import { LavaClient } from 'discord-akairo'
import Spawn from '../../models/SpawnProfile'

const dbSpawn = (client: LavaClient) => ({
	create: async (
		userID: Snowflake
	): Promise<boolean | any> => {
		const user: User = client.users.cache.get(userID);
		if (!user || user.bot) return false;
		const data = new Spawn({ userID: user.id });
		return data;
	},

	fetch: async (
		userID: Snowflake
	): Promise<any> => {
		const data = await Spawn.findOne({ userID });
		if (!data) {
			await dbSpawn(client).create(userID);
			return dbSpawn(client).fetch(userID);
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
		data.eventsJoined += amount;
		await data.save();
		return data;
	},
	decrementJoinedEvents: async (
		userID: Snowflake, 
		amount?: number,
	): Promise<any> => {
		const data = await dbSpawn(client).fetch(userID);
		data.eventsJoined -= amount;
		await data.save();
		return data;
	}
});

export default dbSpawn;