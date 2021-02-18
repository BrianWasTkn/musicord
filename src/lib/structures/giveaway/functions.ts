import { Message, Guild, GuildChannel } from 'discord.js'
import { Document, Model } from 'mongoose'
import Giveaway from './model'

export default function dbGiveaway(
    client: Akairo.Client
): Lava.GiveawayFunction {
    return {
        fetchAll: async (): Promise<(Document & Lava.Giveaway)[]> => {
            const __all = await Giveaway.find({})
            return <(Document & Lava.Giveaway)[]>__all
        },

        fetchGiveaway: async (
            messageID: Message['id']
        ): Promise<Document & Lava.Giveaway> => {
            const fetched = await Giveaway.findOne({ messageID })
            return <Document & Lava.Giveaway>fetched
        },
    }
}
