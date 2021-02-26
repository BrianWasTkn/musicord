declare namespace Lava {
  import {
    ClientOptions,
    EmojiResolvable,
    Snowflake,
    User,
    IntentsString,
    Message,
    Guild,
    GuildMember,
    GuildChannel,
  } from 'discord.js';
  import {
    AkairoClient,
    AkairoOptions,
    AkairoHandlerOptions,
    ListenerHandler,
    CommandHandler,
    CommandHandlerOptions,
  } from 'discord-akairo';
  import mongoose, { Document, Model } from 'mongoose';

  //#region Interfaces

  // Core
  interface Konstructor {
    dev?: boolean;
    ownerID?: string[];
    prefix?: string | string[];
    intents?: ClientOptions['ws']['intents'][];
    token: string;
    config: Config;
  }

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
    intents: ClientOptions['ws']['intents'][];
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
    pocket: number;
    vault: number;
    space: number;
    multi: number;
    won: number;
    lost: number;
    wins: number;
    loses: number;
    gifted: number;
  }

  interface SpawnDocument extends Document {
    userID: Snowflake;
    unpaid: number;
    eventsJoined: number;
  }

  interface BotSettings extends Document {
    prefix: string[] | string;
    owners: string[];
    devMode: boolean;
    spawners: boolean;
  }

  interface CurrencyFunction {
    util: CurrencyUtil;
    create: (userID: Snowflake) => Promise<Document<Lava.CurrencyProfile>>;
    fetch: (userID: Snowflake) => Promise<Document & CurrencyProfile>;
    addPocket: (
      userID: Snowflake,
      amount: number
    ) => Promise<Document & CurrencyProfile>;
    removePocket: (
      userID: Snowflake,
      amount: number
    ) => Promise<Document & CurrencyProfile>;
    addVault: (
      userID: Snowflake,
      amount: number
    ) => Promise<Document & CurrencyProfile>;
    removeVault: (
      userID: Snowflake,
      amount: number
    ) => Promise<Document & CurrencyProfile>;
    addSpace: (
      userID: Snowflake,
      amount: number
    ) => Promise<Document & CurrencyProfile>;
    removeSpace: (
      userID: Snowflake,
      amount: number
    ) => Promise<Document & CurrencyProfile>;
    addMulti: (
      userID: Snowflake,
      amount: number
    ) => Promise<Document & CurrencyProfile>;
    removeMulti: (
      userID: Snowflake,
      amount: number
    ) => Promise<Document & CurrencyProfile>;
  }

  interface SpawnFunction {
    create: (userID: Snowflake) => Promise<Document<SpawnDocument>>;
    fetch: (userID: Snowflake) => Promise<Document & SpawnDocument>;
    addUnpaid: (
      userID: Snowflake,
      amount: number
    ) => Promise<Document & SpawnDocument>;
    removeUnpaid: (
      userID: Snowflake,
      amount: number
    ) => Promise<Document & SpawnDocument>;
    incrementJoinedEvents: (
      userID: Snowflake,
      amount?: number
    ) => Promise<Document & SpawnDocument>;
    decrementJoinedEvents: (
      userID: Snowflake,
      amount?: number
    ) => Promise<Document & SpawnDocument>;
  }

  interface GiveawayFunction {
    fetchAll: () => Promise<Array<Document & Giveaway>>;
    fetchGiveaway: (messageID: Message['id']) => Promise<Document & Giveaway>;
  }

  interface CurrencyUtil {
    calcMulti: (
      Lava: Akairo.Client,
      _: Message
    ) => Promise<{ unlocked: string[]; total: number }>;
  }

  interface Giveaway extends Document {
    _id: Guild['id'];
    channelID: GuildChannel['id'];
    messageID: Message['id'];
    giveaway: GiveawayOptions;
  }

  interface GiveawayOptions {
    winnerCount: number;
    host: User['id'];
    prize: string;
    startTime: number;
    endTime: number;
    ended: boolean;
  }
  //#endregion Interfaces

  //#region Types
  type CurrencyFunctions = (client: Akairo.Client) => Partial<CurrencyFunction>;
  type CurrencyCaps = { [cap: string]: number };
  type Colors = { [color: string]: number };
}
