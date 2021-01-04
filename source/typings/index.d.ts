import { 
	Snowflake, Collection, Message, Guild, 
	MessageEmbed,
	EmojiResolvable 
} from 'discord.js'
import { 
	AkairoClient, ListenerHandler, CommandHandler,
	ClientUtil
} from 'discord-akairo'

export class LavaClient extends AkairoClient {
	public listsnerHandler: ListenerHandler;
	public commandHandler: CommandHandler;
	public spawners: Collection<string, Spawner>;
	public config: Config;
	public Util: Util;
}

export class Spawner {
	constructor(client: LavaClient, config: SpawnConfig, visuals: SpawnVisuals);
	public queue: Collection<Snowflake, any>;
	public spawn: SpawnVisuals;
	public config: SpawnConfig;
	public client: LavaClient;

	private checkSpawn(channel: any): boolean;
	private runCooldown(channel: any): void;
	public run(message: Message): Promise<any>;
	private collectMessages(event: Message, channel: any, guild: Guild): Promise<any>;
}

export class Util extends ClientUtil {
	constructor(client: LavaClient);
	public random(type: RandomType, entries: any[]): any;
	public console(struct: string, type: ConsoleType, _: string, err?: Error): void;
}

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

export type SpawnVisualsType = 'COMMON' | 'SUPER' | 'GODLY';
export type RandomType = 'arr' | 'num';
export type ConsoleType = 'main' | 'error';