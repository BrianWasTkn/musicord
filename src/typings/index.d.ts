import { 
	Snowflake, Collection, Message, Guild, 
	MessageEmbed, GuildChannel, GuildMember,
	EmojiResolvable, User, Role
} from 'discord.js'
import { 
	AkairoClient, ListenerHandler, CommandHandler,
	Listener, Command, ClientUtil
} from 'discord-akairo'

declare module 'discord-akairo' {

	// Structures
	export class LavaClient extends AkairoClient {
		listenerHandler: ListenerHandler;
		commandHandler: CommandHandler;
		spawners: Collection<string, LavaSpawner>;
		queue: Collection<Snowflake, any>;
		heists: Collection<Snowflake, Role>;
		config: any;
		util: LavaUtils;
		db: DBInterface;
	}

	export class LavaUtils extends ClientUtil {
		constructor(client: LavaClient);
		public random(type: RandomType, entries: any[]): any;
		public log(struct: string, type: ConsoleType, _: string, err?: Error): void;
		public sleep(ms: number): Promise<number>;
	}

	export class LavaSpawner {
		constructor(client: LavaClient, config: SpawnConfig, visuals: SpawnVisuals);
		public queue: Collection<Snowflake, User>;
		public spawn: SpawnVisuals;
		public config: SpawnConfig;
		public answered: Collection<Snowflake, GuildMember>;
		public client: LavaClient;

		public checkSpawn(channel: any): boolean;
		public runCooldown(channel: any): void;
		public run(message: Message): Promise<MessageEmbed>;
		public spawnMessage(channel: any): Promise<Message>;
		public collectMessages(event: Message, channel: any, guild: Guild): Promise<any>;
	}

	// interfaces
	export interface DBInterface {
		spawns: SpawnDB;
		currency: CurrencyDB;
	}

	export interface SpawnDB {
		create: (userID: Snowflake) => Promise<any>;
		fetch: (userID: Snowflake) => Promise<any>;
		addUnpaid: (userID: Snowflake, amount: number) => Promise<any>;
		removeUnpaid: (userID: Snowflake, amount: number) => Promise<any>;
		incrementJoinedEvents: (userID: Snowflake, amount: number) => Promise<any>;
		decrementJoinedEvents: (userID: Snowflake, amount: number) => Promise<any>;
	}

	export interface CurrencyDB {
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

	// Types
	export type SpawnVisualsType = 'COMMON' | 'SUPER' | 'GODLY' | 'UNCOMMON';
	export type RandomType = 'arr' | 'num';
	export type ConsoleType = 'main' | 'error';
}
