import { 
	Snowflake, Collection, Message, Guild, 
	MessageEmbed, GuildChannel, GuildMember,
	EmojiResolvable 
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
		config: any;
		util: LavaUtils;
		db: DBInterface;
	}

	export class LavaListener extends Listener {
		client: LavaClient;
	}

	export class LavaCommand extends Command {
		client: LavaClient;
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

	export class LavaDB {
		public constructor(client: LavaClient);
	}

	export class SpawnDB extends LavaDB {
		public constructor(client: LavaClient);
		public _createProfile({ userID }: { userID: Snowflake }): Promise<any>;
		public fetch({ userID }: { userID: Snowflake }): Promise<any>;
		public add({ 
			userID, amount, type  
		}: { 
			userID: Snowflake, 
			amount: number,
			type: 'paid' | 'unpaid' | 'eventsJoined' | 'cooldown'
		}): Promise<any>;
		public remove({ 
			userID, amount, type  
		}: { 
			userID: Snowflake, 
			amount: number,
			type: 'paid' | 'unpaid' | 'eventsJoined' | 'cooldown'
		}): Promise<any>;
	}

	export class CurrencyDB extends LavaDB {
		public constructor(client: LavaClient);
		public _createProfile({ userID }: { userID: Snowflake }): Promise<any>;
		public fetch({ userID }: { userID: Snowflake }): Promise<any>;
		public add({
			userID, amount, type
		}: {
			userID: string, 
			amount: number, 
			type: 'pocket' | 'vault' | 'space'
		}): Promise<any>;
		public deduct({
			userID, amount, type
		}: {
			userID: string, 
			amount: number, 
			type: 'pocket' | 'vault' | 'space'
		}): Promise<any>;
	}

	// interfaces
	export interface DBInterface {
		db: LavaDB;
		spawns: SpawnDB;
		currency: CurrencyDB;
	}

	export interface SpawnConfig {
		odds: number;
		cooldown: number;
		enabled: boolean;
		timeout: number;
		entries: number;
		rewards: {
			min: number;
			max: number;
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
	export type SpawnVisualsType = 'COMMON' | 'SUPER' | 'GODLY';
	export type RandomType = 'arr' | 'num';
	export type ConsoleType = 'main' | 'error';
}
