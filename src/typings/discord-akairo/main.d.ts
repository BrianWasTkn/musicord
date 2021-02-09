declare namespace Akairo {
    import { 
        AkairoClient,
        AkairoOptions, 
        AkairoHandler,
        AkairoHandlerOptions,
        AkairoModule,
        AkairoModuleOptions,
        ListenerHandler,
        ListenerHandlerOptions,
        CommandHandler,
        CommandHandlerOptions,
        ClientUtil
    } from 'discord-akairo'
    import {
        Message,
        Collection,
        User, Role, Guild,
        GuildChannel,
        GuildMember,
        EmojiResolvable,
        TextChannel,
        ClientOptions,
        Constructable
    } from 'discord.js'
    import {
        EventEmitter
    } from 'events'

    class Client extends AkairoClient {
        public constructor(akairoOptions: AkairoOptions, clientOptions: ClientOptions);
        public listenerHandler: ListenerHandler;
        public commandHandler: CommandHandler;
        public spawnHandler: SpawnHandler;
        public giveawayManager: GiveawayHandler;
        public config: Lava.Config;
        public util: Util;
        public db: Lava.DatabaseEndpoint;
        public handle(): void;
        public connectDB(): Promise<void>;
        public build(): Promise<string>;
    }

    class SpawnHandler extends AkairoHandler {
        public constructor(client: Client, options: AkairoHandlerOptions);
        public client: Client;
        public modules: Collection<string, Spawn>;
        public cooldowns: Collection<Snowflake, Spawn>;
        public queue: Collection<Snowflake, SpawnQueue>;
        public messages: Collection<Snowflake, Message>;
        public spawn(spawner: Lava.Spawner, message: Message): Promise<void>;
    }

    class GiveawayHandler extends EventEmitter {
        public constructor(client: Client);
        public client: Client;
        public giveaways: Collection<Guild["id"], CollectionFlake<Message>>;
    }

    class Util extends ClientUtil {
        public constructor(client: Client);
        public heists: Collection<GuildChannel["id"], Role>;
        public paginateArray(array: any[], size: number): Array<any[]>;
        public randomInArray(array: any[]): any;
        public randomNumber(min: number, max: number): number;
        public randomColor(): number;
        public log(struct: string, type: string, _: string, error?: Error): void;
        public sleep(ms: number): Promise<number>;
    }

    class Spawn extends AkairoModule {
        public constructor(
            client: Client, 
            config: SpawnConfig,
            spawn: SpawnVisual, 
            cooldown: SpawnConfig["cooldown"]
        );
        public client: Client;
        public spawn: SpawnVisual;
        public config: SpawnConfig;
        public answered: Collection<User["id"], User>;
    }

    interface SpawnConfig {
		odds: number;
		type: SpawnConfigType;
		cooldown?: SpawnCooldown;
		enabled: boolean;
		timeout: number;
		entries: number;
		rewards: SpawnReward;
    }

    interface SpawnVisual {
        emoji: EmojiResolvable;
		type: SpawnVisualsType;
		title: string;
		description: string;
		strings: string[];
    }

    interface SpawnQueue {
        channel: TextChannel;
		spawn: Spawn;
        msgId: Snowflake;
    }
    
    type Structure = Guild | Role | Message | User;
    type CollectionFlake<T extends Constructable<Structure>> = Collection<T["id"], T>;
    type SpawnVisualsType = 'COMMON' | 'UNCOMMON' | 'SUPER' | 'GODLY';
    type SpawnConfigType = 'message' | 'spam' | 'react';
    type SpawnCooldown = (member: GuildMember) => number;
    type SpawnReward = { [reward: string]: number };
}