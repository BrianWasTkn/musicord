import { Snowflake, User } from 'discord.js'
import Spawn from '../../models/SpawnProfile'

export default client => ({
	create: async (
		userID: Snowflake
	): Promise<any> => {
		const user: User = await client.users.cache.get(userID);
		if (!user || user.bot) return false;
		const data = new Spawn({ userID: user.id });
		return data;
	},
	fetch: async (
		userID: Snowflake
	): Promise<any> => {
		const data = await Spawn.findOne({ userID });
		if (!data) {
			await this.create(userID);
			return this.fetch(userID);
		} else {
			return data;
		}
	},

	addUnpaid: async (
		userID: Snowflake, 
		amount: number,
	): Promise<any> => {
		const data = await this.fetch(userID);
		data.unpaid += amount;
		await data.save();
		return data;
	},
	removeUnpaid: async (
		userID: Snowflake, 
		amount: number,
	): Promise<any> => {
		const data = await this.fetch(userID);
		data.paid -= amount;
		await data.save();
		return data;
	},

	incrementJoinedEvents: async (
		userID: Snowflake, 
		amount?: number,
	): Promise<any> => {
		const data = await this.fetch(userID);
		data.eventsJoined += amount;
		await data.save();
		return data;
	},
	decrementJoinedEvents: async (
		userID: Snowflake, 
		amount?: number,
	): Promise<any> => {
		const data = await this.fetch(userID);
		data.eventsJoined -= amount;
		await data.save();
		return data;
	}
});