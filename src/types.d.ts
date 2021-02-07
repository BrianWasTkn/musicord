declare namespace Lava {
    import {
        ClientOptions,
        EmojiResolvable,
        Snowflake,
        Message
    } from 'discord.js'
    import {
        Document,
        Model
    } from 'mongoose'

    //#region Classes
    //#endregion Classes

    //#region Interfaces

    // Configs
    interface Config {
        bot: ConfigLava;
        spawns: ConfigSpawn;
        currency: ConfigCurrency;
    }

    interface ConfigLava {
        dev: boolean;
        token: string;
        prefix: string[];
        ownerID: Snowflake[];
        clientOptions: ClientOptions;
    }

    interface ConfigSpawn {
        enabled: boolean;
        unpaidCap: number;
        defaultCooldown: number;
        blacklistedChannels: Snowflake[];
        whitelistedCategories: Snowflake[];
    }

    interface ConfigCurrency {
        gambleCaps: CurrencyCaps;
        slotMachine: CurrencySlots;
    }

    // Database
    interface DatabaseEndpoint {
        currency: CurrencyFunction;
        spawns: SpawnFunction;
    }

    interface CurrencyProfile extends Document {
        userID: Snowflake;
        items: any[];
        cooldowns: any[];
        pocket: number; vault: number;
        space: number;  multi: number;
        won: number;    lost: number;
        wins: number;   loses: number;
        gifted: number;
    }

    interface SpawnDocument extends Document {
        userID: Snowflake;
        unpaid: number;
        eventsJoined: number;
    }

    interface CurrencyFunction {
        util: CurrencyUtil;
		create: (userID: Snowflake) => Promise<Document<CurrencyProfile>>;
		fetch: (userID: Snowflake) => Promise<Document & CurrencyProfile>;
		addPocket: (userID: Snowflake, amount: number) => Promise<Document & CurrencyProfile>;
		removePocket: (userID: Snowflake, amount: number) => Promise<Document & CurrencyProfile>;
		addVault: (userID: Snowflake, amount: number) => Promise<Document & CurrencyProfile>;
		removeVault: (userID: Snowflake, amount: number) => Promise<Document & CurrencyProfile>;
		addSpace: (userID: Snowflake, amount: number) => Promise<Document & CurrencyProfile>;
		removeSpace: (userID: Snowflake, amount: number) => Promise<Document & CurrencyProfile>;
		addMulti: (userID: Snowflake, amount: number) => Promise<Document & CurrencyProfile>;
		removeMulti: (userID: Snowflake, amount: number) => Promise<Document & CurrencyProfile>;
    }

    interface SpawnFunction {
        create: (userID: Snowflake) => Promise<any>;
		fetch: (userID: Snowflake) => Promise<Document & SpawnDocument>;
		addUnpaid: (userID: Snowflake, amount: number) => Promise<Document & SpawnDocument>;
		removeUnpaid: (userID: Snowflake, amount: number) => Promise<Document & SpawnDocument>;
		incrementJoinedEvents: (userID: Snowflake, amount?: number) => Promise<Document & SpawnDocument>;
		decrementJoinedEvents: (userID: Snowflake, amount?: number) => Promise<Document & SpawnDocument>;
    }

    interface CurrencyUtil {
		calcMulti: (Lava: Akairo.Client, _: Message) => Promise<number>;
	}
    //#endregion Interfaces

    //#region Types 
    type CurrencyFunctions = (client: Akairo.Client) => (Partial<CurrencyFunction>);
    type CurrencyCaps = { [cap: string]: number };
    type CurrencySlots = { [emoji: EmojiResolvable]: number };
}