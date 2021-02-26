import { Snowflake } from 'discord.js'
import { Document } from 'mongoose'

export interface CurrencyProfile extends Document {
	userID: Snowflake
	items: any[]
	cooldowns: any[]
	pocket: number
	vault: number
	space: number
	multi: number
	won: number
	lost: number
	wins: number
	loses: number
	gifted: number
}