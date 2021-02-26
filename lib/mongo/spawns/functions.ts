import { 
    SpawnFunction, 
    SpawnDocument 
} from '../../interface/mongo/spawns'
export { SpawnFunction } from '../../interface/mongo/spawns'
import { Snowflake, User } from 'discord.js'
import { Document } from 'mongoose'
import { Lava } from '../../Lava'
import Spawn from './model'

export function dbSpawn(client: Lava): SpawnFunction {
    return {
        create: async (
            userID: Snowflake
        ): Promise<Document<SpawnDocument>> => {
            const user: User = client.users.cache.get(userID)
            const data: Document<SpawnDocument> = new Spawn({
                userID: user.id,
            })
            await data.save()
            return data
        },

        fetch: async (
            userID: Snowflake
        ): Promise<Document & SpawnDocument> => {
            const data = await Spawn.findOne({ userID })
            if (!data) {
                const newData = await dbSpawn(client).create(userID)
                return newData as Document & SpawnDocument
            } else {
                return data as Document & SpawnDocument
            }
        },

        addUnpaid: async (
            userID: Snowflake,
            amount: number
        ): Promise<Document & SpawnDocument> => {
            const data = await dbSpawn(client).fetch(userID)
            data.unpaid += amount
            await data.save()
            return data
        },
        removeUnpaid: async (
            userID: Snowflake,
            amount: number
        ): Promise<Document & SpawnDocument> => {
            const data = await dbSpawn(client).fetch(userID)
            data.unpaid -= amount
            await data.save()
            return data
        },

        incrementJoinedEvents: async (
            userID: Snowflake,
            amount?: number
        ): Promise<Document & SpawnDocument> => {
            const data = await dbSpawn(client).fetch(userID)
            data.eventsJoined += amount || 1
            await data.save()
            return data
        },
        decrementJoinedEvents: async (
            userID: Snowflake,
            amount?: number
        ): Promise<Document & SpawnDocument> => {
            const data = await dbSpawn(client).fetch(userID)
            data.eventsJoined -= amount || 1
            await data.save()
            return data
        },
    }
}
