import { SpawnDocument } from './spawndocument'
import { Snowflake } from 'discord.js'
import { Document } from 'mongoose'

export interface SpawnFunction {
	create: (userID: Snowflake) => Promise<Document<SpawnDocument>>
	fetch: (userID: Snowflake) => Promise<Document & SpawnDocument>
	addUnpaid: (
		userID: Snowflake,
		amount: number
	) => Promise<Document & SpawnDocument>
	removeUnpaid: (
		userID: Snowflake,
		amount: number
	) => Promise<Document & SpawnDocument>
	incrementJoinedEvents: (
		userID: Snowflake,
		amount?: number
	) => Promise<Document & SpawnDocument>
	decrementJoinedEvents: (
		userID: Snowflake,
		amount?: number
	) => Promise<Document & SpawnDocument>
}