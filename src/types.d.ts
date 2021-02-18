declare namespace Lava {
    import {
        ClientOptions,
        EmojiResolvable,
        Snowflake,
        User,
        Message,
        Guild,
        GuildMember,
        GuildChannel,
    } from 'discord.js'
    import { Document, Model } from 'mongoose'

    //#region Classes
    //#endregion Classes

    //#region Interfaces

    // Util
    // Configs
    interface Config {
        bot: ConfigLava
        spawns: ConfigSpawn
        currency: ConfigCurrency
    }

    interface ConfigLava {
        dev: boolean
        token: string
        prefix: string[]
        ownerID: Snowflake[]
        clientOptions: ClientOptions
    }

    interface ConfigSpawn {
        enabled: boolean
        unpaidCap: number
        defaultCooldown: number
        blacklistedChannels: Snowflake[]
        whitelistedCategories: Snowflake[]
    }

    interface ConfigCurrency {
        gambleCaps: CurrencyCaps
        slotMachine: CurrencySlots
    }

    // Database
    interface DatabaseEndpoint {
        currency: CurrencyFunction
        spawns: SpawnFunction
        giveaways: GiveawayFunction
    }

    interface CurrencyProfile extends Document {
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

    interface SpawnDocument extends Document {
        userID: Snowflake
        unpaid: number
        eventsJoined: number
    }

    interface CurrencyFunction {
        util: CurrencyUtil
        create: (userID: Snowflake) => Promise<Document<Lava.CurrencyProfile>>
        fetch: (userID: Snowflake) => Promise<Document & CurrencyProfile>
        addPocket: (
            userID: Snowflake,
            amount: number
        ) => Promise<Document & CurrencyProfile>
        removePocket: (
            userID: Snowflake,
            amount: number
        ) => Promise<Document & CurrencyProfile>
        addVault: (
            userID: Snowflake,
            amount: number
        ) => Promise<Document & CurrencyProfile>
        removeVault: (
            userID: Snowflake,
            amount: number
        ) => Promise<Document & CurrencyProfile>
        addSpace: (
            userID: Snowflake,
            amount: number
        ) => Promise<Document & CurrencyProfile>
        removeSpace: (
            userID: Snowflake,
            amount: number
        ) => Promise<Document & CurrencyProfile>
        addMulti: (
            userID: Snowflake,
            amount: number
        ) => Promise<Document & CurrencyProfile>
        removeMulti: (
            userID: Snowflake,
            amount: number
        ) => Promise<Document & CurrencyProfile>
    }

    interface SpawnFunction {
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

    interface GiveawayFunction {
        fetchAll: () => Promise<Array<Document & Giveaway>>
        fetchGiveaway: (
            messageID: Message['id']
        ) => Promise<Document & Giveaway>
    }

    interface CurrencyUtil {
        calcMulti: (
            Lava: Akairo.Client,
            _: Message
        ) => Promise<{ unlocked: string[]; total: number }>
    }

    interface Giveaway extends Document {
        _id: Guild['id']
        channelID: GuildChannel['id']
        messageID: Message['id']
        giveaway: GiveawayOptions
    }

    interface GiveawayOptions {
        winnerCount: number
        host: User['id']
        prize: string
        startTime: number
        endTime: number
        ended: boolean
    }
    //#endregion Interfaces

    //#region Types
    type CurrencyFunctions = (
        client: Akairo.Client
    ) => Partial<CurrencyFunction>
    type CurrencyCaps = { [cap: string]: number }
    type CurrencySlots = { [emoji: EmojiResolvable]: number }
    type Colors = { [color: string]: number }
}
