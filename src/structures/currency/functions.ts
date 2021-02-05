import { Snowflake, User } from 'discord.js'
import { Document, Model } from 'mongoose'
import { Client } from 'discord-akairo'
import Currency from './model'
import utils from './util'

export default function dbCurrency(client: Client): Lava.DBCurrency {
	return ({
		util: utils,
		create: async (
			userID: Snowflake
		): Promise<Document<Lava.DBCurrencyDocument>> => {
			const user: User = await client.users.fetch(userID)
			const data: Document<Lava.DBCurrencyDocument> = new Currency({ userID: user.id })
			await data.save()
			return data
		},

		fetch: async (
			userID: Snowflake
		): Promise<Document & Lava.DBCurrencyDocument> => {
			const data = await Currency.findOne({ userID })
			if (!data) {
				const newDat = await dbCurrency(client).create(userID)
				return (newDat as Document & Lava.DBCurrencyDocument);
			} else {
				return (data as Document & Lava.DBCurrencyDocument);
			}
		},

		addPocket: async (
			userID: Snowflake,
			amount: number
		): Promise<any> => {
			const data = await dbCurrency(client).fetch(userID)
			data.pocket += amount
			await data.save()
			return data
		},
		removePocket: async (
			userID: Snowflake,
			amount: number
		): Promise<any> => {
			const data = await dbCurrency(client).fetch(userID)
			data.pocket -= amount
			await data.save()
			return data
		},

		addVault: async (
			userID: Snowflake,
			amount: number
		): Promise<any> => {
			const data = await dbCurrency(client).fetch(userID)
			data.vault += amount
			await data.save()
			return data
		},
		removeVault: async (
			userID: Snowflake,
			amount: number
		): Promise<any> => {
			const data = await dbCurrency(client).fetch(userID)
			data.vault -= amount
			await data.save()
			return data
		},

		addSpace: async (
			userID: Snowflake,
			amount: number
		): Promise<any> => {
			const data = await dbCurrency(client).fetch(userID)
			data.space += amount
			await data.save()
			return data
		},
		removeSpace: async (
			userID: Snowflake,
			amount: number
		): Promise<any> => {
			const data = await dbCurrency(client).fetch(userID)
			data.space -= amount
			await data.save()
			return data
		},

		addMulti: async (
			userID: Snowflake,
			amount: number
		): Promise<any> => {
			const data = await dbCurrency(client).fetch(userID)
			data.multi += amount
			await data.save()
			return data
		},
		removeMulti: async (
			userID: Snowflake,
			amount: number
		): Promise<any> => {
			const data = await dbCurrency(client).fetch(userID)
			data.multi -= amount
			await data.save()
			return data
		}
	})
}