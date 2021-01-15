import { LavaClient } from 'discord-akairo'
import { Snowflake } from 'discord.js'

import CurrencyProfile from '../models/CurrencyProfile'
import Guild from '../models/GuildSettings'
import SpawnProfile from '../models/SpawnProfile'

export class LavaDB {
	public client: LavaClient;
	public constructor(client: LavaClient) {
		this.client = client;
	}
}

// Spawner
export class SpawnDB extends LavaDB {
	public constructor(client: LavaClient) {
		super(client);
	}

	public _createProfile({ userID }: { userID: Snowflake }): any {
		const data = new SpawnProfile({ userID });
		await data.save();
		return data;
	}

	/**
	 * Fetch or create a new user
	 * @param {string} userID the id of the user
	 * @returns {Promise<any>}
	*/
	public async fetch({ userID }: { userID: Snowflake }): Promise<boolean | any> {
		const user = this.client.users.cache.get(userID);
		if (!user || user.bot) return false;
		const data = await SpawnProfile.findOne({ userID });
		if (!data) return this._createProfile({ userID });
		return data;
	}

	/**
	 * Add certain amount to someone else's data
	 * @param {string} userID the id of the user
	 * @param {number} amount the amount to be added
	 * @returns {Promise<any>}
	*/
	public async add({ 
		userID, amount, type
	}: { 
		userID: Snowflake, 
		amount: number,
		type: 'paid' | 'unpaid'
	}): Promise<void> {
		const data = await this.fetch({ userID });
		data[type] += Number(amount);
		await data.save();
		return data;
	}

	/**
	 * Subtract certain amount to someone else's data
	 * @param {string} userID the id of the user
	 * @param {number} amount the amount to be subtracted
	 * @returns {Promise<any>}
	*/
	public async remove({ 
		userID, amount, type
	}: { 
		userID: Snowflake, 
		amount: number,
		type: 'paid' | 'unpaid'
	}): Promise<void> {
		const data = await this.fetch({ userID });
		data[type] -= Number(amount);
		await data.save();
		return data;
	}
}

// Currency
export class CurrencyDB extends LavaDB {
	public constructor(client: LavaClient) {
		super(client);
	}

	public _createProfile({ userID }: { userID: Snowflake }): any {
		const data = new CurrencyProfile({ userID });
		await data.save();
		return data;
	}

	/**
	 * Fetch or create a new user
	 * @param {string} userID the id of the user
	 * @returns {Promise<any>}
	*/
	public async fetch({ userID }: { userID: Snowflake }): Promise<boolean | any> {
		const user = this.client.users.cache.get(userID);
		if (!user || user.bot) return false;
		const data = await CurrencyProfile.findOne({ userID });
		if (!data) return this._createProfile({ userID });
		return data;
	}

	/**
	 * Add certain amount to someone else's data
	 * @param {string} userID the id of the user
	 * @param {number} amount the amount to be added
	 * @param {string} type the type to be added
	 * * pocket - pocket amount
	 * * vault - bank amount
	 * * space - bank space amount
	 * @returns {Promise<any>}
	*/
	public async add({
		userID, amount, type
	}: {
		userID: string, 
		amount: number, 
		type: 'pocket' | 'vault' | 'space'
	}): Promise<any> {
		const user = this.client.users.cache.get(userID);
		if (!user || user.bot) return false;
		const data = await this.fetch({ userID: user.id });
		data[type] += amount;
		await data.save();
		return data;
	}

	/**
	 * Subtract certain amount to someone else's data
	 * @param {string} userID the id of the user
	 * @param {number} amount the amount to be subtracted
	 * @param {string} type the type to be subtracted
	 * * pocket - pocket amount
	 * * vault - bank amount
	 * * space - bank space amount
	 * @returns {Promise<any>}
	*/
	public async deduct({
		userID, amount, type
	}: {
		userID: string, 
		amount: number, 
		type: 'pocket' | 'vault' | 'space'
	}): Promise<any> {
		const user = this.client.users.cache.get(userID);
		if (!user || user.bot) return false;
		const data = await CurrencyProfile.findOne({ userID: user.id });
		data[type] -= amount;
		await data.save();
		return data;
	}
}