import { 
	Snowflake, Collection, Message, Guild, 
	MessageEmbed, GuildChannel,
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
		config: BotConfig;
		util: LavaUtils;
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
		public spawn: SpawnVisuals;
		public config: SpawnConfig;
		public client: LavaClient;

		public checkSpawn(channel: any): boolean;
		public runCooldown(channel: any): void;
		public run(message: Message): Promise<MessageEmbed>;
		public spawnMessage(channel: any): Promise<Message>;
		public collectMessages(event: Message, channel: any, guild: Guild): Promise<any>;
	}

	// Interfaces
	export interface BotConfig {
		dev?: boolean,
		prefixes: string | string[],
		owners: Snowflake | Snowflake[],
		token: string,
		mastery: object,
		amari: object,
		spawn: {
			rateLimit: number,
			blChannels: Snowflake[],
			categories: Snowflake[]
		}
	}

	export interface SpawnConfig {
		odds: number,
		cooldown: number,
		enabled: boolean,
		timeout: number,
		entries: number,
		rewards: {
			min: number,
			max: number
		}
	}

	export interface SpawnVisuals {
		emoji: EmojiResolvable,
		type: SpawnVisualsType,
		title: string,
		description: string,
		strings: string[]
	}

	// Types
	export type SpawnVisualsType = 'COMMON' | 'SUPER' | 'GODLY';
	export type RandomType = 'arr' | 'num';
	export type ConsoleType = 'main' | 'error';
}
