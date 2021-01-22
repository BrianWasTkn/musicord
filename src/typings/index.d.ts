import { 
	Snowflake, Collection, Message, Guild, 
	MessageEmbed, GuildChannel, GuildMember,
	EmojiResolvable, User, Role, ClientOptions
} from 'discord.js'
import { 
	AkairoClient, ListenerHandler, CommandHandler,
	Listener, Command, ClientUtil
} from 'discord-akairo'

export module 'discord-akairo' {
	// Structures
	export class Client extends AkairoClient {
		spawners: Collection<string, Spawner>;
		queue: Collection<Snowflake, any>;
		heists: Collection<Snowflake, Role>;
		config: Config;
		util: Utils;
		db: DB;
		listenerHandler: ListenerHandler;
		commandHandler: CommandHandler;
		importSpawners(): void;
		build(): Promise<void>;
		connectDB(): Promise<void>;
		login(token: string): Promise<string>;
	}
	export class Utils extends ClientUtil {
		constructor(client: LavaClient);
		static paginateArray(array: any[], size: number): (string[])[];
		static random(type: RandomType, entries: any[]): any;
		static log(struct: string, type: ConsoleType, _: string, err?: Error): void;
		static sleep(ms: number): Promise<number>;
	}
	export class Spawner {
		constructor(client: Client, config: SpawnConfig, visuals: SpawnVisuals);
		queue: Collection<Snowflake, User>;
		spawn: SpawnVisuals;
		config: SpawnConfig;
		answered: Collection<Snowflake, GuildMember>;
		client: Client;
		runCooldown(channel: any): void;
		run(message: Message): Promise<MessageEmbed>;
		spawnMessage(channel: any): Promise<Message>;
		collectMessages(event: Message, channel: any, guild: Guild): Promise<any>;
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
		incrementJoinedEvents: (userID: Snowflake, amount: number) => Promise<any>;
		decrementJoinedEvents: (userID: Snowflake, amount: number) => Promise<any>;
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
		odds: number;
		cooldown: (member: GuildMember) => number;
		enabled: boolean;
		timeout: number;
		entries: number;
		rewards: {
			min: number;
			max: number;
			first: number;
		}
	}
	export interface SpawnVisuals {
		emoji: EmojiResolvable;
		type: SpawnVisualsType;
		title: string;
		description: string;
		strings: string[];
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
		emojis: Array<{
			emoji: string;
			winnings: number;
		}>;
	}
	export interface ConfigSpawns {
		cooldown: number;
		enabled: boolean;
		blacklisted: {
			[bl: string]: Snowflake[];
		};
		whitelisted: {
			[wl: string]: Snowflake[];
		}
	}

	// Types
	export type SpawnVisualsType = 'COMMON' | 'SUPER' | 'GODLY' | 'UNCOMMON';
	export type RandomType = 'arr' | 'num';
	export type ConsoleType = 'main' | 'error';
}