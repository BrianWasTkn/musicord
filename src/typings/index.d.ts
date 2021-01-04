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

	// Base Structures
	export class LavaClient extends AkairoClient {
		public listenerHandler: ListenerHandler;
		public commandHandler: CommandHandler;
		public spawners: Collection<string, LavaSpawner>;
		public spawns: Collection<string, GuildChannel>;
		public config: Config;
		public utils: LavaUtils;
	}

	export class LavaListener extends Listener {
		public client: LavaClient;
	}

	export class LavaCommand extends Command {
		public client: LavaClient;
	}

	export class LavaSpawner {
		constructor(client: LavaClient, config: SpawnConfig, visuals: SpawnVisuals);
		public queue: Collection<Snowflake, any>;
		public spawn: SpawnVisuals;
		public config: SpawnConfig;
		public client: LavaClient;

		public checkSpawn(channel: any): boolean;
		public runCooldown(channel: any): void;
		public run(message: Message): Promise<MessageEmbed>;
		public spawnMessage(channel: any): Promise<Message>;
		public collectMessages(event: Message, channel: any, guild: Guild): Promise<any>;
	}

	export class LavaUtils extends ClientUtil {
		constructor(client: LavaClient);
		public random(type: RandomType, entries: any[]): any;
		public log(struct: string, type: ConsoleType, _: string, err?: Error): void;
	}

	// Interfaces
	export interface Config {
		dev?: boolean,
		prefixes: string | string[],
		owners: string | string[],
		token: string,
		spawn: {
			rateLimit: number,
			blChannels: string[],
			categories: string[]
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
