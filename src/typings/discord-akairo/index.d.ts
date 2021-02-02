import { 
	Snowflake, Collection, Message, Guild, 
	MessageEmbed, GuildChannel, GuildMember,
	EmojiResolvable, User, Role, ClientOptions,
	MessageReaction, TextableChannel, GuildTextable,
	TextBasedChannel, TextChannel
} from 'discord.js'

import { 
	AkairoClient, AkairoHandler, AkairoModule,
	ListenerHandler, CommandHandler,
	Listener, Command, ClientUtil
} from 'discord-akairo'
import {
	EventEmitter
} from 'events'

export module 'discord-akairo' {
	// Structures
	export class Client extends AkairoClient {
		heists: Collection<Snowflake, Role>;
		config: Config;
		util: Utils;
		db: DB;
		listenerHandler: ListenerHandler;
		commandHandler: CommandHandler;
		spawnHandler: SpawnHandler;
		build(): Promise<void>;
		connectDB(): Promise<void>;
		login(token: string): Promise<string>;
	}
	export class Utils extends ClientUtil {
		constructor(client: LavaClient);
		paginateArray(array: any[], size: number): any[][];
		randomInArray(array: any[]): any;
		randomNumber(min?: number, max?: number): number;
		randomColor(): number;
		log(struct: string, type: ConsoleType, _: string, err?: Error): void;
		sleep(ms?: number): Promise<number>;
	}
	export class SpawnHandler extends AkairoHandler {
		constructor(client: Client, handlerOptions: AkairoHandlerOptions);
		client: Client;
		modules: Collection<string, Spawn>;
		cooldowns: Collection<Snowflake, Spawn>;
		queue: Collection<Snowflake, SpawnQueue>;
		messages: Collection<Snowflake, Message>
		spawn(spawner: Spawn, message: Message): Promise<void>;
	}
	export class Spawn extends AkairoModule {
		constructor(client: Client, config: SpawnConfig, visuals: SpawnVisuals);
		client: Client;
		spawn: SpawnVisuals;
		config: SpawnConfig;
		answered: Collection<Snowflake, User>;
	}


	// Interface - DB
	export interface DB {
		currency: DBCurrency;
		spawns: DBSpawns;
	}
	export interface DBSpawns {
		create: (userID: Snowflake) => Promise<any>;
		fetch: (userID: Snowflake) => Promise<any>;
		addUnpaid: (userID: Snowflake, amount: number) => Promise<any>;
		removeUnpaid: (userID: Snowflake, amount: number) => Promise<any>;
		incrementJoinedEvents: (userID: Snowflake, amount?: number) => Promise<any>;
		decrementJoinedEvents: (userID: Snowflake, amount?: number) => Promise<any>;
	}
	export interface DBCurrency {
		util: DBCurrencyUtil;
		create: (userID: Snowflake) => Promise<any>;
		fetch: (userID: Snowflake) => Promise<any>;
		addPocket: (userID: Snowflake, amount: number) => Promise<any>;
		removePocket: (userID: Snowflake, amount: number) => Promise<any>;
		addVault: (userID: Snowflake, amount: number) => Promise<any>;
		removeVault: (userID: Snowflake, amount: number) => Promise<any>;
		addSpace: (userID: Snowflake, amount: number) => Promise<any>;
		removeSpace: (userID: Snowflake, amount: number) => Promise<any>;
		addMulti: (userID: Snowflake, amount: number) => Promise<any>;
		removeMulti: (userID: Snowflake, amount: number) => Promise<any>;
	}
	export interface DBCurrencyUtil {
		calcMulti: (Lava: Client, _: Message) => Promise<number>;
	}

	// Interface - Spawns 
	export interface SpawnConfig {
		odds?: number;
		type?: SpawnSummonType;
		cooldown?: (member: GuildMember) => number;
		enabled?: boolean;
		timeout?: number;
		entries?: number;
		rewards?: {
			min?: number;
			max?: number;
			first?: number;
		}
	}
	export interface SpawnVisuals {
		emoji?: EmojiResolvable;
		type?: SpawnVisualsType;
		title?: string;
		description?: string;
		strings?: string[];
	}
	export interface SpawnQueue {
		channel: TextChannel;
		spawn: Spawn;
		msgId: Snowflake;
	}

	// Interface - Config
	export interface Config {
		lava: ConfigLava;
		currency: ConfigCurrency;
		spawns: ConfigSpawns;
	}
	export interface AkairoConfig {
		ownerID: Snowflake[];
	}
	export interface ConfigLava {
		devMode: boolean;
		prefix: string[];
		token: string;
		akairo: AkairoConfig;
		client: ClientOptions;
	}
	export interface ConfigCurrency {
		caps: {
			[k: string]: number;
		};
		slots: {
			emojis: EmojiResolvable[];
			winnings: number[]
		}
	}
	export interface ConfigSpawns {
		cooldown: number;
		enabled: boolean;
		cap: number;
		blacklisted: {
			[bl: string]: Snowflake[];
		};
		whitelisted: {
			[wl: string]: Snowflake[];
		}
	}

	// Types
	export type SpawnSummonType = 'message' | 'react' | 'spam';
	export type SpawnVisualsType = 'COMMON' | 'SUPER' | 'GODLY' | 'UNCOMMON';
	export type ConsoleType = 'main' | 'error';
}