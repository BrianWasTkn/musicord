declare namespace Lava {
    import { 
        AkairoClient,
        AkairoOptions 
    } from 'discord-akairo'
    import {
        ClientOptions,
        EmojiResolvable,
        Snowflake
    } from 'discord.js'
    import {
        Document,
        Model
    } from 'mongoose'

    //#region Classes
    class Client extends AkairoClient {
        public constructor(config: Config);
        public [key: string]: any;
    }

    //#endregion Classes

    //#region 
    interface Config {
        Lava: LavaConfig;
        Spawns: SpawnConfig;
        Currency: CurrencyConfig;
    }

    interface SpawnConfig {
        enabled: boolean;
        unpaidCap: number;
    }

    interface CurrencyConfig {
        caps: CurrencyCaps;
        slots: CurrencySlots;
    }

    interface DBCurrencyDocument extends Document {
        userID: Snowflake;
        items: any[];
        cooldowns: any[];
        pocket: number; vault: number;
        space: number;  multi: number;
        won: number;    lost: number;
        wins: number;   loses: number;
        gifted: number;
    }

    const DBCurrency: (client: Client) => {
        create: (userID: Snowflake) => Promise<Document<DBCurrencyDocument>>;
		fetch: (userID: Snowflake) => Promise<any>;
		addUnpaid: (userID: Snowflake, amount: number) => Promise<any>;
		removeUnpaid: (userID: Snowflake, amount: number) => Promise<any>;
		incrementJoinedEvents: (userID: Snowflake, amount?: number) => Promise<any>;
		decrementJoinedEvents: (userID: Snowflake, amount?: number) => Promise<any>;
    }
    //#endregion Interfaces

    //#region Types 
    type CurrencyCaps = { [cap: string]: number };
    type CurrencySlots = { 
        emojis: EmojiResolvable[], 
        winnings: number[] 
    };
}