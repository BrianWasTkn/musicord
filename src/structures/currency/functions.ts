import { Snowflake, User } from 'discord.js'
import { Document } from 'mongoose'
import { utils } from './util'
import Currency from './model'

export default function dbCurrency(client: Akairo.Client): Lava.CurrencyFunction {
	return ({
		util: utils,
		create: async (userID: Snowflake): Promise<Document<Lava.CurrencyProfile>> => {
			const user: User = await client.users.fetch(userID)
			const data: Document<Lava.CurrencyProfile> = new Currency({ userID: user.id })
			await data.save()
			return data
		},

		fetch: async (userID: Snowflake): Promise<Document & Lava.CurrencyProfile> => {
			const data = await Currency.findOne({ userID })
			if (!data) {
				const newDat = await dbCurrency(client).create(userID)
				return (newDat as Document & Lava.CurrencyProfile)
			} else {
				return (data as Document & Lava.CurrencyProfile)
			}
		},

		addPocket: async (
			userID: Snowflake,
			amount: number
		): Promise<Document & Lava.CurrencyProfile> => {
			const data: Document & Lava.CurrencyProfile = await dbCurrency(client).fetch(userID)
			data.pocket += amount
			await data.save()
			return data
		},
		removePocket: async (
			userID: Snowflake,
			amount: number
		): Promise<Document & Lava.CurrencyProfile> => {
			const data = await dbCurrency(client).fetch(userID)
			data.pocket -= amount
			await data.save()
			return data
		},

		addVault: async (
			userID: Snowflake,
			amount: number
		): Promise<Document & Lava.CurrencyProfile> => {
			const data = await dbCurrency(client).fetch(userID)
			data.vault += amount
			await data.save()
			return data
		},
		removeVault: async (
			userID: Snowflake,
			amount: number
		): Promise<Document & Lava.CurrencyProfile> => {
			const data = await dbCurrency(client).fetch(userID)
			data.vault -= amount
			await data.save()
			return data
		},

		addSpace: async (
			userID: Snowflake,
			amount: number
		): Promise<Document & Lava.CurrencyProfile> => {
			const data = await dbCurrency(client).fetch(userID)
			data.space += amount
			await data.save()
			return data
		},
		removeSpace: async (
			userID: Snowflake,
			amount: number
		): Promise<Document & Lava.CurrencyProfile> => {
			const data = await dbCurrency(client).fetch(userID)
			data.space -= amount
			await data.save()
			return data
		},

		addMulti: async (
			userID: Snowflake,
			amount: number
		): Promise<Document & Lava.CurrencyProfile> => {
			const data = await dbCurrency(client).fetch(userID)
			data.multi += amount
			await data.save()
			return data
		},
		removeMulti: async (
			userID: Snowflake,
			amount: number
		): Promise<Document & Lava.CurrencyProfile> => {
			const data = await dbCurrency(client).fetch(userID)
			data.multi -= amount
			await data.save()
			return data
		}
	})
}