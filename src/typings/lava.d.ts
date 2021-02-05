declare namespace Lava {
    import { 
        AkairoClient,
        AkairoOptions 
    } from 'discord-akairo'
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

    interface DBCurrency {
        util: DBCurrencyUtil;
		create: (userID: Snowflake) => Promise<Document<DBCurrencyDocument>>;
		fetch: (userID: Snowflake) => Promise<Document & DBCurrencyDocument>;
		addPocket: (userID: Snowflake, amount: number) => Promise<any>;
		removePocket: (userID: Snowflake, amount: number) => Promise<any>;
		addVault: (userID: Snowflake, amount: number) => Promise<any>;
		removeVault: (userID: Snowflake, amount: number) => Promise<any>;
		addSpace: (userID: Snowflake, amount: number) => Promise<any>;
		removeSpace: (userID: Snowflake, amount: number) => Promise<any>;
		addMulti: (userID: Snowflake, amount: number) => Promise<any>;
		removeMulti: (userID: Snowflake, amount: number) => Promise<any>;
    }
    interface DBCurrencyUtil {
		calcMulti: (Lava: Client, _: Message) => Promise<number>;
	}
    //#endregion Interfaces

    //#region Types 
    type DBCurrency = (client: Client) => (Partial<DBCurrency>);
    type CurrencyCaps = { [cap: string]: number };
    type CurrencySlots = { 
        emojis: EmojiResolvable[], 
        winnings: number[] 
    };
}