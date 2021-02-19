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
        ClientUtil,
    } from 'discord-akairo'
    import {
        Message,
        Collection,
        User,
        Role,
        Guild,
        GuildChannel,
        GuildMember,
        EmojiResolvable,
        TextChannel,
        ClientOptions,
        Constructable,
    } from 'discord.js'
    import { EventEmitter } from 'events'
    import mongoose from 'mongoose'

    class Client extends AkairoClient {
        public handlers: Handlers
        public config: Lava.Config
        public util: Util;
        public db: Lava.DatabaseEndpoint
        public build(token?: string): Promise<string>

        public constructor(args: Konstructor)
    }

    class SpawnHandler extends AkairoHandler {
        public client: Akairo.Client
        public modules: Collection<string, Spawn>
        public cooldowns: Collection<Snowflake, Spawn>
        public queue: Collection<Snowflake, SpawnQueue>
        public messages: Collection<Snowflake, Message>
        public spawn(spawner: Lava.Spawner, message: Message): Promise<void>

        public constructor(client: Client, options: AkairoHandlerOptions)
    }

    class GiveawayHandler extends EventEmitter {
        public client: Client
        public giveaways: Collection<Guild['id'], Lava.Giveaway[]>
        
        public constructor(client: Client)
    }

    class ModuleHandler extends AkairoHandler {
        public modules: Collection<string, Module>
        public client: Client
        
        public constructor(client: Client, options: AkairoHandlerOptions)
    }

    class Util extends ClientUtil {
        public heists: Collection<GuildChannel['id'], Role>
        public events: Collection<string, string>
        public paginateArray(array: any[], size: number): Array<any[]>
        public randomInArray(array: any[]): any
        public randomNumber(min: number, max: number): number
        public randomColor(): number
        public log(struct: string, type: string, _: string, error?: Error): void
        public sleep(ms: number): Promise<number>
        public static Colors: Lava.Colors

        public constructor(client: Client)
    }

    class Spawn extends AkairoModule {
        public client: Client
        public spawn: SpawnVisual
        public config: SpawnConfig
        public answered: Collection<User['id'], User>

        public constructor(
            config: SpawnConfig,
            spawn: SpawnVisual,
            cooldown: SpawnConfig['cooldown']
        )
    }

    interface Handlers {
        emitter: ListenerHandler
        command: CommandHandler;
        spawn: SpawnHandler;
    }
        
    interface SpawnConfig {
        odds: number
        type: SpawnConfigType
        cooldown?: SpawnCooldown
        enabled: boolean
        timeout: number
        entries: number
        rewards: SpawnReward
    }

    interface SpawnVisual {
        emoji: EmojiResolvable
        type: SpawnVisualsType
        title: string
        description: string
        strings: string[]
    }

    interface SpawnQueue {
        channel: TextChannel
        spawn: Spawn
        msgId: Snowflake
    }

    type Structure = Guild | Role | Message | User
    type CollectionFlake<T extends Constructable<Structure>> = Collection<
        T['id'],
        T
    >
    type SpawnVisualsType = 'COMMON' | 'UNCOMMON' | 'SUPER' | 'GODLY'
    type SpawnConfigType = 'message' | 'spam' | 'react'
    type SpawnCooldown = (member: GuildMember) => number
    type SpawnReward = { [reward: string]: number }
}
